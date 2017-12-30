import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions'
import 'reflect-metadata'

import { createConnection } from 'typeorm'
import { Connection } from 'typeorm/connection/Connection'

import { BaseError } from '../common/error'
import { Note } from '../models/Note'

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
      console.log(`Established a connection to DB ${connection.options.database}`)

      const rs = await q(connection)
      connection.close()
      return rs
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
    host: process.env.POSTGRES_URI,
    port: parseInt(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities: [
      // __dirname + '/models/*.js' // `__dirname` is the directory name of the current module
      Note // TODO: use the method above to automatically find models instead
    ],
    synchronize: true,
    logging: false
  }

  return await createConnection(options)
    .catch((err: Error) => {
      throw new DatabaseNotConnectedError(err.message) // use our own error class instead
    })
}
