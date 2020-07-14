import passport from 'passport'
import UserModel, { IUserModel } from '../UserController/model'
import { AccessTokenModel, ClientModel, IAccessToken, IClient } from './model'
import * as bearer from 'passport-http-bearer'
import * as pl from 'passport-local'
import * as OAuth2cp from 'passport-oauth2-client-password'
import { BasicStrategy } from 'passport-http'

const LocalStrategy = pl.Strategy
const BearerStrategy = bearer.Strategy
const ClientPasswordStrategy = OAuth2cp.Strategy

passport.use(
  new LocalStrategy((username: string, password: string, done) => {
    UserModel.findOne({ username }, (error, user: IUserModel) => {
      if (error) return done(error)
      if (!user) return done(null, false)
      if (user.password !== password) return done(null, false)
      return done(null, user)
    })
  })
)

passport.serializeUser((user: IUserModel, done) => done(null, user.id))

passport.deserializeUser((id, done) => {
  UserModel.findById(id, (error, user) => done(error, user))
})

function verifyClient(
  clientId: string,
  clientSecret: string,
  done: (error: Error | null, client: IClient | boolean) => void
) {
  ClientModel.findOne({ clientId }, (error, client: IClient) => {
    if (error) return done(error, false)
    if (!client) return done(null, false)
    if (client.clientSecret !== clientSecret) return done(null, false)
    return done(null, client)
  })
}

passport.use(new BasicStrategy(verifyClient))

passport.use(new ClientPasswordStrategy(verifyClient))

passport.use(
  new BearerStrategy((accessToken, done) => {
    AccessTokenModel.findOne(
      { token: accessToken },
      (error, token: IAccessToken) => {
        if (error) return done(error)
        if (!token) return done(null, false)
        if (token.userId) {
          UserModel.findById({ _id: token.userId }, (error, user) => {
            if (error) return done(error)
            if (!user) return done(null, false)
            done(null, user)
          })
        } else {
          ClientModel.findOne(
            { cliendId: token.clientId },
            (error, client: IClient) => {
              if (error) return done(error)
              if (!client) return done(null, false)
              done(null, client)
            }
          )
        }
      }
    )
  })
)

export default passport
