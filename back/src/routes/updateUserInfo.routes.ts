import { Router } from 'express'
import dbConnect from '../utils/dbConnect'
// jwt
import jwt from 'jsonwebtoken'

const router = Router()

router.post('/', async (req, res) => {
  // 从请求头的token中获取用户id
  const token = req.headers.authorization?.split(' ')[1]
  const decoded = jwt.decode(token)
  const id = decoded.id
  const { username, email, name, studentId, gender, mobile, avatar } = req.body
  const connection = await dbConnect()
  await connection.execute(
    'Update user set username = ?, email = ? ,name = ?, studentId = ?, gender = ?, mobile = ?, avatar = ? where id = ?',
    [username, email, name, studentId, gender, mobile, avatar, id]
  )
  res.status(200).json({
    message: '更新用户信息成功',
    code: 200,
  })
})

export default router
