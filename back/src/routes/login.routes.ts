import { Router } from 'express'
import dbConnect from '../utils/dbConnect'
// jwt
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import config from '../config/default'

const router = Router()

router.post('/', async (req, res) => {
  const { password, email, username } = req.body
  const connection = await dbConnect()
  // 加密密码
  const md5 = crypto.createHash('md5')
  md5.update(password)
  const md5Password = md5.digest('hex')
  const [rows, fields] = await connection.execute(
    'Select * from user where password = ? and (email = ? or username = ?)',
    [md5Password, email, username]
  )
  if (rows[0] && rows[0].password === md5Password) {
    // jwt签发token
    const token = jwt.sign(
      {
        email: rows[0].email,
        username: rows[0].username,
        role: rows[0].role,
        id: rows[0].id,
      },
      config.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    )
    res.status(200).json({
      message: '登录成功',
      code: 200,
      token,
      role: rows[0].role,
      username: rows[0].username,
      email: rows[0].email,
      name: rows[0].name,
      studentId: rows[0].studentId,
      mobile: rows[0].mobile,
    })
  } else {
    res.status(200).json({
      message: '用户名或密码错误',
      code: 400,
    })
  }
})

export default router
