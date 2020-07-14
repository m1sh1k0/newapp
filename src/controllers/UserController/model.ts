import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcrypt'

export interface IUserModel extends Document {
  email: string
  username: string
  password: string
  checkPassword: (password: string) => Promise<boolean>
}

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false
  }
).pre('save', async function (this: IUserModel, next): Promise<void> {
  // eslint-disable-next-line
  const user: any = this

  if (!user.isModified('password')) {
    return next()
  }

  try {
    const salt: string = await bcrypt.genSalt(10)

    const hash: string = await bcrypt.hash(user.password, salt)

    user.password = hash
    next()
  } catch (error) {
    return next(error)
  }
})

UserSchema.virtual('userId').get(function (this: IUserModel) {
  return this._id
})

UserSchema.methods.checkPassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    const match: boolean = await bcrypt.compare(
      candidatePassword,
      this.password
    )

    return match
  } catch (error) {
    return error
  }
}

export default mongoose.model<IUserModel>('UserModel', UserSchema)
