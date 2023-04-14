import { Router } from 'express'
import dbConnect from '../utils/dbConnect'
import crypto from 'crypto'

const router = Router()

router.post('/', async (req, res) => {
    const { password, email, emailCode } = req.body
    const connection = await dbConnect()
    const [rows, fields] = await connection.execute(
        'Select create_time from email_code where email = ? and code = ?',
        [email, emailCode]
    )
    if (rows[0].length === 0) {
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
                // 加密密码
                const md5 = crypto.createHash('md5')
                md5.update(password)
                const md5Password = md5.digest('hex')
                await connection.execute(
                    'Update user set password = ? where email = ?',[md5Password, email]
                )
                res.status(200).json({
                    message: '密码修改成功',
                    code: 200,
                })  
            } else {
                res.status(200).json({
                    message: '邮箱未注册',
                    code: 200,
                })
            }
        }
    }
})

export default router