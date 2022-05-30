import express from 'express'

import cors from 'cors'
import bearerToken from 'express-bearer-token'
import helmet from 'helmet'
import path from 'path'
import jsend from 'jsend'

import { attachUserInfo, errorHandler } from './middlewares'
import { serviceRouter } from './routes'

class App {
  public app: express.Application

  constructor() {
    this.app = express()
    this.initializeMiddlewares()
    this.initializeRouter()
    this.initializeErrorHandlers()
  }

  private initializeRouter() {
    this.app.use('/', serviceRouter)
  }

  private initializeMiddlewares() {
    this.app.use(helmet())
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(express.static(path.join(__dirname, '/assets')))
    this.app.use(
      bearerToken({
        headerKey: 'Bearer',
        reqKey: 'token',
      })
    )
    this.app.use(attachUserInfo)
    this.app.use(jsend.middleware)
  }

  private initializeErrorHandlers() {
    this.app.use(errorHandler)
  }
}

export default App
