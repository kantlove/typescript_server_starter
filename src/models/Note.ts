import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { BaseModel } from './base'
import { ModelQueries } from './ModelQueries'

@Entity()
export class Note implements BaseModel {
  @PrimaryGeneratedColumn()
  readonly id: number

  @Column('text')
  readonly text: string

  static queries = new ModelQueries<Note>(Note)

  constructor(text: string) {
    this.text = text
  }
}
