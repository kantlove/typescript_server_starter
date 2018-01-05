import { Request, Response } from 'express'

import { Note } from '../models/Note'
import { db } from '../services/db'

export const index = (req: Request, res: Response) => {
  db(async connection => {
    // Clear all notes
    await remove()
    // Add some dummy notes
    await init()

    const notes = await Note.queries.all(connection)

    res.render('note', {
      title: 'All notes',
      notes: notes
    })
  })
}

function init() {
  const someNotes = [
    'You can avoid reality, but you cannot avoid the consequences of avoiding reality.',
    "Only two things are infinite, the universe and human stupidity, and I'm not sure about the former.",
    'Words are memes that can be pronounced.',
    'Make memes, not wars.',
    'Never let someone waste your time twice.',
    'If people are talking about you behind your back, fart.',
    "You miss 100% of the shots you don't take."
  ]

  return Promise.all(someNotes.map(async note => await createNote(note)))
}

async function createNote(text: string) {
  await db(async connection => {
    const note = new Note(text)
    const savedNote = await Note.queries.insert(note)(connection)
  })
}

async function remove(condition: Partial<Note> = {}) {
  await db(async connection => await Note.queries.remove(condition)(connection))
}
