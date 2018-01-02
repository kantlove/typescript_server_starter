import 'reflect-metadata'

import { createConnection } from 'typeorm'
import { Connection } from 'typeorm/connection/Connection'
import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions'

import { BaseError } from '../common/error'

export class DatabaseNotConnectedError extends BaseError { }
export class QueryError extends BaseError { }

/**
 * This query receives a connection.
 */
export type Query<A> = (c: Connection) => Promise<A>

/**
 * Execute the query `q` with 1 DB connection. The connection will be
 * closed after that.
 *
 * Example usage:
 * ```
 *  db(async connection => {
 *    return await connection.getRepository(Note).find()
 *  })
 * ```
 * @template A type of the result.
 * @param q the query to be executed.
 */
export function db<A>(q: Query<A>) {
  return connect()
    .then(async connection => {
      console.log(`Established a connection named "${connection.name}" to DB ${connection.options.database}`)

      try {
        return await q(connection)
      }
      finally {
        console.log(`Close connection "${connection.name}"`)
        connection.close()
      }
    })
    .catch((err: Error) => {
      throw new QueryError(err.message)
    })
}

/**
 * Try connecting to the database.
 */
async function connect(): Promise<Connection> {
  const options: ConnectionOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities: [
      __dirname + '/../models/*.js' // `__dirname` is the directory name of the current module
    ],
    synchronize: true,
    logging: false
  }

  return await createConnection(options)
    .catch((err: Error) => {
      throw new DatabaseNotConnectedError(err.message) // use our own error class instead
    })
}
