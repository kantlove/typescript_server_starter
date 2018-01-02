import { Request, Response } from 'express'
import { NextFunction } from 'express-serve-static-core'
import * as passport from 'passport'

import { User } from '../models/User'

export const index = (req: Request, res: Response) => {
  res.render('login', { title: 'Log In' })
}

interface AuthInfo {
  message: string
}

export const login = (req: Request, res: Response, next: NextFunction) => {
  const loginLogic = (err: Error, user: User, info: AuthInfo) => {
    if (err) return next(err)
    if (!user) {
      req.flash('error', info.message)
      return res.redirect('/login')
    }

    /**
     * `logIn` method is added by `passport` to establish a login session.
     * @see http://www.passportjs.org/docs/login/
     */
    req.logIn(user, (err: Error) => {
      if (err) return next(err)

      req.flash('success', `Logged in as ${user}`)
      res.redirect('/note')
    })
  }

  passport.authenticate('local', loginLogic)(req, res, next)
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  /**
   * `isAuthenticated` method is added by `passport` to establish a login session.
   * Unfortunately, this is not documentated anywhere at the moment of this writing :(
   */
  if (req.isAuthenticated()) return next()
  res.redirect('/login')
}
