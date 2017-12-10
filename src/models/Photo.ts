import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column('bigint')
  views: number
}