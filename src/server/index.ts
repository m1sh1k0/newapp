import express from 'express'
import { PORT } from './config/constants'
import logger from './middleware/logger'
import * as Routes from '../routes'
import mongooseConnection from './config/mongoose'
import bodyParser from 'body-parser'

mongooseConnection()

const app = express()

app.use(logger)
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
Routes.initShedule()
Routes.init(app)

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
