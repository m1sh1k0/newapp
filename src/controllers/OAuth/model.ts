import mongoose, { Schema, Document } from 'mongoose'

export interface IClient extends Document {
  id: string
  name: string
  clientId: string
  clientSecret: string
}

const Client = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true
    },
    clientId: {
      type: String,
      unique: true,
      required: true
    },
    clientSecret: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false
  }
)

export const ClientModel = mongoose.model<IClient>('Client', Client)

export interface IAccessToken extends Document {
  id: string
  userId: string
  clientId: string
  token: string
}

const AccessToken = new Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  clientId: {
    type: String,
    required: true
  },
  token: {
    type: String,
    unique: true,
    required: true
  }
})

export const AccessTokenModel = mongoose.model<IAccessToken>(
  'AccessToken',
  AccessToken
)

export interface IRefreshToken extends Document {
  id: string
  userId: string
  clientId: string
  token: string
}

const RefreshToken = new Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  clientId: {
    type: String,
    required: true
  },
  token: {
    type: String,
    unique: true,
    required: true
  }
})

export const RefreshTokenModel = mongoose.model<IAccessToken>(
  'RefreshToken',
  RefreshToken
)
export interface IAuthorizationCode extends Document {
  code: string
  userId: string
  clientId: string
  redirectURI: string
  scope: string
  username: string
}

const AuthorizationCode = new Schema({
  code: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  username: {
    type: String
  },
  clientId: {
    type: String,
    required: true
  },
  redirectURI: {
    type: String
  },
  scope: {
    type: String,
    default: '*'
  }
})

export const AuthorizationCodeModel = mongoose.model<IAuthorizationCode>(
  'AuthorizationCode',
  AuthorizationCode
)
