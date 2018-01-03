import 'reflect-metadata'

import { createConnection, getConnection } from 'typeorm'
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
export function db<A>(q: Query<A>): Promise<A> {
  return connect()
    .then(async connection => await q(connection))
    .catch((err: Error) => {
      throw new QueryError(err.message)
    })
}

/**
 * Returns a connection to the current DB. This will create a new connection
 * if there is no existing one.
 * 
 * So currently, our app only uses 1 single DB connection.
 */
async function connect(): Promise<Connection> {
  const connectionName = 'default'

  try {
    return getConnection(connectionName)
  }
  catch (_) { // if there is no existing connection with that name
    const options: ConnectionOptions = {
      name: connectionName,
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
      .then(connection => {
        console.log(`Established a connection named "${connection.name}" to DB ${connection.options.database}`)
        return connection
      })
      .catch((err: Error) => {
        throw new DatabaseNotConnectedError(err.message) // use our own error class instead
      })
  }
}
