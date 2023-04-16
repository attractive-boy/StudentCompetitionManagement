import { Router } from 'express'
import { uptime } from 'process'
import dbConnect from '../utils/dbConnect'

const router = Router()

router.get('/', async (req, res) => {
  // 分页查询
  const { page, pageSize, studentId, name, mobile } = req.query
  const where = []
  if (studentId) {
    where.push(`studentId = '${studentId}'`)
  }
  if (name) {
    where.push(`name like '%${name}%'`)
  }
  if (mobile) {
    where.push(`mobile = '${mobile}'`)
  }
  const connection = await dbConnect()
  const [rows, fields] = await connection.execute(
    `Select id, studentId, name, gender, avatar, mobile from user where role = ? ${
      where.length > 0 ? 'and ' + where.join(' and ') : ''
    } order by studentId desc limit ${pageSize} offset ${
      (page - 1) * pageSize
    }`,
    ['student']
  )
  const [count, fields2] = await connection.execute(
    `Select count(*) as count from user where role = ? ${
      where.length > 0 ? 'and ' + where.join(' and ') : ''
    }`,
    ['student']
  )
  const list: any = rows
  // 给list加上第几个
  list.forEach((item, index) => {
    item.index = (page - 1) * pageSize + index + 1
  })
  res.status(200).json({
    message: '获取学生列表成功',
    code: 200,
    data: {
      list: list,
      total: count[0].count,
    },
  })
})

// 修改学生信息
router.post('/update', async (req, res) => {
  const { id, studentId, name, gender, avatar, mobile } = req.body
  const connection = await dbConnect()
  await connection.execute(
    `update user set studentId = ?,name = ?, gender = ?, avatar = ?, mobile = ? where id = ?`,
    [studentId, name, gender, avatar, mobile, id]
  )
  res.status(200).json({
    message: '修改学生信息成功',
    code: 200,
  })
})

// 删除学生
router.post('/delete', async (req, res) => {
  const { id } = req.body
  const connection = await dbConnect()
  await connection.execute(`delete from user where id = ?`, [id])
  res.status(200).json({
    message: '删除学生成功',
    code: 200,
  })
})

export default router