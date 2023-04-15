import { Router } from 'express'
import dbConnect from '../utils/dbConnect'
// jwt
import jwt from 'jsonwebtoken'

const router = Router()

router.get('/', async (req, res) => {
  // 从请求头的token中获取用户邮箱
  const token = req.headers.authorization?.split(' ')[1]
  const decoded = jwt.decode(token)
  const email = decoded.email
  const connection = await dbConnect()
  const [rows, fields] = await connection.execute(
    'Select * from user where email = ?',
    [email]
  )
  if (rows[0] && rows[0].email === email) {
    res.status(200).json({
      message: '获取用户信息成功',
      code: 200,
      data: {
        username: rows[0].username,
        email: rows[0].email,
        role: rows[0].role,
        studentId: rows[0].studentId,
        gender: rows[0].gender,
        mobile: rows[0].mobile,
        avatar: rows[0].avatar,
        name: rows[0].name,
      },
    })
  } else {
    res.status(200).json({
      message: '获取用户信息失败',
      code: 400,
    })
  }
})

export default router
