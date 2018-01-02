import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { BaseModel, ModelNotFound } from './base'
import { ModelQueries } from './ModelQueries'

@Entity('users')
export class User implements BaseModel {
  @PrimaryGeneratedColumn()
  readonly id: number

  @Column('varchar')
  readonly email: string

  @Column('varchar')
  readonly password: string

  static queries = new ModelQueries<User>(User)

  constructor(email: string, password: string) {
    this.email = email
    this.password = password
  }

  toString(): string {
    return `${User.name}(email: ${this.email}, password: ${this.password})`
  }
}

export class UserNotFound extends ModelNotFound {
  constructor() {
    super('User')
  }
}
