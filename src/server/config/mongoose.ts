import { MONGOURI } from './constants'
import { ConnectionOptions, connect } from 'mongoose'

export default async function mongooseConnection(): Promise<void> {
  try {
    const mongoURI: string = MONGOURI
    const options: ConnectionOptions = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    }
    await connect(mongoURI, options)
    console.log(`Mongoose connection opened ${MONGOURI}`)
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}
