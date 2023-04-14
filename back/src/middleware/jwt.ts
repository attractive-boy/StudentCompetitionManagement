import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

import config from '../config/default'

const { JWT_SECRET } = config

//不需要token的路由
const whiteList = [
  '/api/login',
  '/api/register',
  '/api/register/code',
  '/api/forgotPassword',
]

const jwt = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  const url = req.url
  if (whiteList.includes(url)) {
    next()
  } else {
    if (token) {
      verify(token, JWT_SECRET, (err: any, decoded: any) => {
        if (err) {
          console.log(err.message)
          res.status(401).json({
            message: 'token失效，请重新登录',
            code: 401,
          })
        } else {
          next()
        }
      })
    } else {
      res.status(401).json({
        message: 'token失效，请重新登录',
        code: 401,
      })
    }
  }
}

export default jwt
