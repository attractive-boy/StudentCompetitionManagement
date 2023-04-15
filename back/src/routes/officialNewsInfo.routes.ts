import { Router } from 'express'
import dbConnect from '../utils/dbConnect'
//uuid
import { v4 as uuidv4 } from 'uuid'
const router = Router()

router.get('/', async (req, res) => {
  // 分页查询
  const { page, pageSize, title, type } = req.query
  const where = []
  if (title) {
    where.push(`title like '%${title}%'`)
  }
  if (type) {
    where.push(`type = '${type}'`)
  }
  const connection = await dbConnect()
  //判断是否有查询条件
  const [rows, fields] = await connection.execute(
    `Select * from officialnews ${
      where.length > 0 ? 'where ' + where.join(' and ') : ''
    } order by date desc limit ${pageSize} offset ${(page - 1) * pageSize}`
  )
  const [count, fields2] = await connection.execute(
    `Select count(*) as count from officialnews ${
      where.length > 0 ? 'where ' + where.join(' and ') : ''
    }`
  )
  const list: any = rows
  console.log(list)
  // 给list加上第几个
  list.forEach((item, index) => {
    item.index = (page - 1) * pageSize + index + 1
  })
  res.status(200).json({
    message: '获取文章列表成功',
    code: 200,
    data: {
      list: list,
      total: count[0].count,
    },
  })
})

// 添加文章
router.post('/add', async (req, res) => {
  const { title, type, content, img } = req.body
  const connection = await dbConnect()
  const date = new Date()
  const id = uuidv4()
  await connection.execute(
    'Insert into officialnews (id, title, type, content, img, date) values (?, ?, ?, ?, ?, ?)',
    [id, title, type, content, img, date]
  )
  res.status(200).json({
    message: '添加文章成功',
    code: 200,
  })
})

// 修改文章
router.post('/edit', async (req, res) => {
  const { id, title, type, content, img } = req.body
  console.log(id, title, type, content, img)
  const connection = await dbConnect()
  await connection.execute(
    'Update officialnews set title = ?, type = ?, content = ?, img = ? where id = ?',
    [title, type, content, img, id]
  )
  res.status(200).json({
    message: '修改文章成功',
    code: 200,
  })
})

// 删除文章
router.post('/delete', async (req, res) => {
  const { id } = req.body
  const connection = await dbConnect()
  await connection.execute('Delete from officialnews where id = ?', [id])
  res.status(200).json({
    message: '删除文章成功',
    code: 200,
  })
})
export default router
