import { Router } from 'express'
import dbConnect from '../utils/dbConnect'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

const router = Router()

router.post('/', async (req, res) => {
  const { oldPassword, newPassword } = req.body
  // 从请求头的token中获取用户邮箱
  const token = req.headers.authorization?.split(' ')[1]
  const decoded = jwt.decode(token)
  const email = decoded.email
  const connection = await dbConnect()
  // 加密密码
  const md5 = crypto.createHash('md5')
  md5.update(oldPassword)
  const md5OldPassword = md5.digest('hex')
  const [rows, fields] = await connection.execute(
    'Select * from user where password = ? and email = ?',
    [md5OldPassword, email]
  )
  if (rows[0]?.username) {
    //更新密码
    const md5 = crypto.createHash('md5')
    md5.update(newPassword)
    const md5NewPassword = md5.digest('hex')
    await connection.execute('Update user set password = ? where email = ?', [
      md5NewPassword,
      email,
    ])
    res.status(200).json({
      message: '密码修改成功',
      code: 200,
    })
  } else {
    res.status(200).json({
      message: '原密码错误',
      code: 400,
    })
  }
})

export default router
