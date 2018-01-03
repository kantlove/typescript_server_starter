import { Request, Response } from 'express'

export const logout = (req: Request, res: Response) => {
  /**
   * `logOut` method is added by `passport` to terminate a log in session
   * (the session will also be removed)
   * @see http://www.passportjs.org/docs/logout/
   */
  req.logOut()
  res.redirect('/login')
}
