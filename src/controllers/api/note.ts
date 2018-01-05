import { Request, Response } from 'express'

import { Note } from '../../models/Note'
import { db } from '../../services/db'

/**
 * @api {delete} /note Remove all notes that match the condition.
 * @apiName RemoveNote
 * @apiGroup Note
 *
 * @apiParam {number} [id] Note unique ID.
 * @apiParam {string} [text] Note content.
 *
 * @apiSuccess {number} removed Number of notes removed.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "removed": 5
 *     }
 *
 * @apiVersion 0.1.0
 */
export const remove = (req: Request, res: Response) => {
  db(async connection => {
    const condition = req.body as Partial<Note>
    const removedNotes = await Note.queries.remove(condition)(connection)
    res.send(removedNotes)
  })
}
