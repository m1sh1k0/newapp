import oauth2orize from 'oauth2orize'
import passport from './passport'
import UIDGenerator from 'uid-generator'
import UserModel from '../UserController/model'
import {
  AccessTokenModel,
  RefreshTokenModel,
  ClientModel,
  IClient,
  IRefreshToken
} from './model'

export const server = oauth2orize.createServer()

server.serializeClient(function (client, callback) {
  return callback(null, client._id)
})

server.deserializeClient(function (id, callback) {
  console.log('des')

  ClientModel.findOne({ _id: id }, function (err, client) {
    if (err) {
      return callback(err)
    }
    return callback(null, client)
  })
})

function issueTokens(
  userId: string,
  clientId: string,
  done: (
    error: Error | null,
    token?: string,
    refreshToken?: string,
    assignObject?: unknown | null
  ) => void
) {
  UserModel.findById({ _id: userId })
    .then(async (user) => {
      const uidgen = new UIDGenerator(256)
      const accessToken = await uidgen.generate()
      const refreshToken = await uidgen.generate()

      AccessTokenModel.create({ token: accessToken, userId, clientId })
        .then(() =>
          RefreshTokenModel.create({
            token: refreshToken,
            userId: userId,
            clientId
          })
            .then(() =>
              done(null, accessToken, refreshToken, {
                username: user?.username
              })
            )
            .catch((error) => done(error))
        )
        .catch((error) => done(error))
    })
    .catch((error) => done(error))
}

server.grant(
  oauth2orize.grant.token((client, user, ares, done) => {
    issueTokens(user.id, client.clientId, done)
  })
)

server.exchange(
  oauth2orize.exchange.password((client, username, password, scope, done) => {
    ClientModel.findOne({ clientId: client.clientId })
      .then((localClient) => {
        if (!localClient) return done(null, false)
        if (localClient.clientSecret !== client.clientSecret)
          return done(null, false)

        UserModel.findOne({ username })
          .then(async (user) => {
            if (!user) return done(null, false)
            const isMatched: boolean = await user.checkPassword(password)
            if (!isMatched) {
              return done(null, false)
            }
            issueTokens(user._id, client.clientId, done)
          })
          .catch((error) => done(error))
      })
      .catch((error) => done(error))
  })
)

server.exchange(
  oauth2orize.exchange.clientCredentials((client, scope, done) => {
    ClientModel.find(
      { cliendId: client.clientId },
      (error, localClient: IClient) => {
        if (error) return done(error)
        if (!localClient) return done(null, false)
        if (localClient.clientSecret !== client.clientSecret)
          return done(null, false)
        issueTokens('', client.clientId, done)
      }
    )
  })
)

server.exchange(
  oauth2orize.exchange.refreshToken(
    (
      client,
      refreshToken,
      scope,
      done: (
        error: Error | null,
        token?: string,
        refreshToken?: string,
        assignObject?: unknown | null
      ) => void
    ) => {
      RefreshTokenModel.findOne(
        { token: refreshToken },
        (error, token: IRefreshToken) => {
          if (error) return done(error)
          if (!token) return done(error, undefined, undefined)
          issueTokens(
            token._id,
            client.clientId,
            (err, accessToken, refreshToken) => {
              if (err) {
                done(err, undefined, undefined)
              }
              AccessTokenModel.findOneAndRemove({ userId: token.userId })
                .then(() =>
                  RefreshTokenModel.findOneAndRemove({
                    userId: token.userId
                  })
                    .then(() => done(null, accessToken, refreshToken))
                    .catch((err) => done(err, undefined, undefined))
                )
                .catch((err) => done(err, undefined, undefined))
            }
          )
        }
      )
    }
  )
)

// eslint-disable-next-line
export const logout = (req: any, res: any) => {
  AccessTokenModel.findOneAndDelete({
    userId: req.user.userId
  }).then(() => res.status(200).json({ msg: 'Success logout' }))
}

export const token = [
  passport.authenticate(['basic', 'oauth2-client-password'], {
    session: false
  }),
  server.token(),
  server.errorHandler()
]
