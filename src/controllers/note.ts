import { Request, Response } from 'express'

import { Note } from '../models/Note'
import { db } from '../services/db'

export const index = (req: Request, res: Response) => {
  db(async connection => {
    const notes = await Note.queries.all(connection)

    res.render('note', {
      title: 'All notes',
      notes: notes
    })
  })
}

export const create = (req: Request, res: Response) => {
  db(async connection => {
    const name = req.body.name
    const text = req.body.text

    const note = new Note(name, text)
    const savedNote = await Note.queries.insert(note)(connection)

    res.send(savedNote)
  })
}

export const remove = (req: Request, res: Response) => {
  db(async connection => {
    const condition = req.body as Partial<Note>
    const removedNotes = await Note.queries.remove(condition)(connection)
    res.send(removedNotes)
  })
}
