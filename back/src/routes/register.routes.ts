import { Router } from 'express'
import dbConnect from '../utils/dbConnect'
import sendEmail from '../utils/mailSend'
import crypto from 'crypto'
const router = Router()

router.post('/', async (req, res) => {
  const { username, password, email, emailCode, role } = req.body
  const connection = await dbConnect()
  const [rows, fields] = await connection.execute(
    'Select create_time from email_code where email = ? and code = ?',
    [email, emailCode]
  )
  if (rows.length === 0) {
    res.status(200).json({
      message: '验证码错误',
      code: 200,
    })
  } else {
    const createTime = rows[0].create_time
    const now = new Date()
    const diff = now.getTime() - createTime.getTime()
    if (diff > 1000 * 60 * 5) {
      res.status(200).json({
        message: '验证码已过期',
        code: 200,
      })
    } else {
      const [rows, fields] = await connection.execute(
        'Select COUNT(*) as count from user where email = ?',
        [email]
      )
      if (rows[0].count === 1) {
        res.status(200).json({
          message: '邮箱已被注册',
          code: 200,
        })
      } else {
        // 密码不可逆加密
        const md5 = crypto.createHash('md5')
        md5.update(password)
        const md5Password = md5.digest('hex')
        await connection.execute(
          'Insert into user (username, password, email, role) values (?, ?, ?, ?)',
          [username, md5Password, email, role]
        )
        res.status(200).json({
          message: '注册成功',
          code: 200,
        })
      }
    }
  }
})

// 获取注册验证码
router.post('/code', async (req, res) => {
  const { email } = req.body
  // 生成6位随机验证码
  const code = Math.random().toString().slice(-6)
  // 发送邮件
  sendEmail(email, '注册验证码', code)
  // 把验证码和邮箱和时间插入或者更新到数据库
  const connection = await dbConnect()
  const [rows, fields] = await connection.execute(
    'Select COUNT(*) as count from email_code where email = ?',
    [email]
  )
  if (rows[0].count === 1) {
    await connection.execute(
      'Update email_code set code = ?, create_time = ? where email = ?',
      [code, new Date(), email]
    )
  } else {
    await connection.execute(
      'Insert into email_code (email, code, create_time) values (?, ?, ?)',
      [email, code, new Date()]
    )
  }
  res.status(200).json({
    message: '验证码发送成功',
    code: 200,
  })
})

export default router
