import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { BaseModel } from './base'
import { ModelQueries } from './ModelQueries'

@Entity()
export class Note implements BaseModel {
  @PrimaryGeneratedColumn()
  readonly id: number

  @Column('varchar')
  readonly name: string

  @Column('text')
  readonly text: string

  static queries = new ModelQueries<Note>(Note)

  constructor(name: string, text: string) {
    this.name = name
    this.text = text
  }
}
