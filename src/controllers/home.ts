import { Request, Response } from 'express'

export const index = (req: Request, res: Response) => {
  res.render('home', {
    title: 'Home'
  })
}

export const custom = (req: Request, res: Response) => {
  res.render('home', {
    title: req.body.title
  })
}