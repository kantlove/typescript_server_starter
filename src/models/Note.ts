import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { ModelQueries } from './ModelQueries'

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar')
  name: string

  @Column('text')
  text: string

  static queries = new ModelQueries<Note>(Note)

  constructor(name: string, text: string) {
    this.name = name
    this.text = text
  }
}
