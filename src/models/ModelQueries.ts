import { Option, option } from 'ts-option'
import { Repository } from 'typeorm'
import { Connection } from 'typeorm/connection/Connection'

import { Query, QueryError } from '../services/db'
import { BaseModel, ModelAlreadyExists } from './base'

/**
 * This class contains common queries of all models.
 *
 * @template A type of the model.
 */
export class ModelQueries<A extends BaseModel> {
  private repr: Function

  /**
   * Creates an instance for a specific model.
   *
   * Example:
   * ```
   * // Create for model Note
   * const noteQueries = new ModelQueries<Note>(Note)
   * ```
   *
   * @param repr the model class
   */
  constructor(repr: Function) {
    this.repr = repr
  }

  protected getRepo(c: Connection): Repository<A> {
    return c.getRepository(this.repr)
  }

  /**
   * Returns a query to get all instances of this model from DB.
   */
  all: Query<A[]> = async connection => {
    return await this.getRepo(connection).find()
  }

  /**
   * Returns a query to find the first instance that matches
   * the condition. If no result is found, the query returns `None`.
   * @param conditions how to find this instance.
   */
  findOne(conditions: Partial<A>): Query<Option<A>> {
    return async connection => {
      const repo = this.getRepo(connection)
      return option(await repo.findOne({ where: conditions }))
    }
  }

  /**
   * Returns a query to find the first instance that matches
   * the condition. If no result is found, the query returns `None`.
   * @param conditions how to find this instance.
   */
  findOneByID(id: number): Query<Option<A>> {
    const condition: Partial<A> = { id: id } as A
    return this.findOne(condition)
  }

  /**
   * Returns a query to insert an instance of this model to DB.
   * Throws error if the instance already exists.
   * @param a instance to be saved.
   */
  insert(a: A): Query<A> {
    return async connection => {
      const maybeA = await this.findOne(a)(connection)
      return maybeA.match({
        some: _ => {
          throw new ModelAlreadyExists()
        },
        none: () => this.getRepo(connection).insert(a).then(_ => a)
      })
    }
  }

  /**
   * Returns a query to remove matching instances of this model from DB.
   *
   * Note that this will remove multiple instances if they all match
   * `conditions`.
   *
   * Example usage:
   * ```
   * remove({name: 'Note 1'})
   * ```
   *
   * @param conditions how to find the instances to be removed.
   */
  remove(conditions: Partial<A>): Query<A[]> {
    return async connection => {
      const repo = this.getRepo(connection)
      const notes = await repo.find(conditions)
      return await repo.remove(notes)
    }
  }
}