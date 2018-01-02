import { Request, Response } from 'express'

import { User } from '../models/User'
import { db } from '../services/db'

export const index = (req: Request, res: Response) => {
  res.render('register', { title: 'Register' })
}

export const register = (req: Request, res: Response) => {
  const email = req.body.email
  const password = req.body.password

  console.log(`Registering email "${email} and password "${password}`)

  db(async connection => {
    const newUser = new User(email, password)
    return await User.queries.insert(newUser)(connection)
  })
  .then(user => {
    req.flash('success', `Logged in as ${user}`)
    res.redirect('/note')
  })
}