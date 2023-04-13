import { Express } from 'express'
import express from 'express'
import responseHeader from './responseHeader'
import jwt from './jwt'
function initMiddleware(app: Express) {
  app.use(express.json())
  app.use(responseHeader)
  app.use(jwt)
}

export default initMiddleware
