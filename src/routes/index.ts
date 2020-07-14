/* eslint-disable @typescript-eslint/no-non-null-assertion */
import express, { Router } from 'express'
import { UserController as user } from '../controllers'
import { token, logout } from '../controllers/OAuth/controller'
import passport from '../controllers/OAuth/passport'
import { FeedController as feed } from '../controllers'
import cron from 'node-cron'

export function init(app: express.Application): void {
  const router: express.Router = express.Router()
  app.use(passport.initialize())

  app.post('/oauth/token', token)
  app.get('/logout', passport.authenticate('bearer', { session: true }), logout)

  app.use('/user', user.create)
  app.use('/feed', feedRouter)
  app.use(
    '/favorites',
    passport.authenticate('bearer', { session: true }),
    favoriteRouter
  )

  app.use((req, res) => {
    res.status(404).json({ error: 404, message: 'Not Found' })
  })

  app.use(router)
}

const favoriteRouter: Router = Router()
const feedRouter: Router = Router()

feedRouter.get('/', feed.readall)
feedRouter.post(
  '/',
  passport.authenticate('bearer', { session: true }),
  feed.create
)
feedRouter.delete(
  '/:id',
  passport.authenticate('bearer', { session: true }),
  feed.deleteUserFeed
)

favoriteRouter.post('/save/:id', feed.addToFavorites)
favoriteRouter.get('/', feed.getUserFavorites)
favoriteRouter.delete('/:id', feed.removeUserFavorite)

export function initShedule(): void {
  cron.schedule('0 0 14 * * *', feed.createByFetch)
}
