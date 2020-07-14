import { Request, Response, NextFunction } from 'express'
import UserModel, { IUserModel } from './model'
import { ClientModel } from '../OAuth/model'

export async function create(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user: IUserModel = await UserModel.create(req.body)

    const clientLikeAccess = await ClientModel.create({
      name: `${req.body.username}-access`,
      clientId: `${req.body.username}-Join.To.It`,
      clientSecret: `${req.body.username}-soSecretly123`
    })
    if (user && clientLikeAccess) {
      res.status(201).json({ user: user, clientLikeAccess })
    } else {
      res.status(500).json({ msg: 'Something went wrong' })
    }
  } catch (error) {
    next(new Error(error.message))
  }
}
