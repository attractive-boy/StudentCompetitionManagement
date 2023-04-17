import { Router } from 'express'
import dbConnect from '../utils/dbConnect'
import { v4 as uuidv4 } from 'uuid'

const router = Router()

router.get('/', async (req, res) => {
  const { page, pageSize, title, type, address }: any = req.query
  const where: any = []
  if (title) {
    where.push(`title like '%${title}%'`)
  }
  if (type) {
    where.push(`type = '${type}'`)
  }
  if (address) {
    where.push(`address like '%${address}%'`)
  }
  const connection = await dbConnect()
  const [rows, fields] = await connection.execute(
    `Select competition.*, JSON_ARRAYAGG(JSON_OBJECT('id', competitionmember.id, 'name', competitionmember.name, 'email', competitionmember.email, 'studentId', competitionmember.studentId, 'number', competitionmember.number, 'mobile', competitionmember.mobile
    )) as member from competition left join competitionmember on competition.id = competitionmember.parentid ${
      where.length > 0 ? 'where ' + where.join(' and ') : ''
    } group by competition.id order by time desc limit ${
      (page - 1) * pageSize
    }, ${pageSize}`
  )
  const [count, fields2] = await connection.execute(
    `Select count(*) as count from competition ${
      where.length > 0 ? 'where ' + where.join(' and ') : ''
    }`
  )
  const list: any = rows
  list.forEach((item, index) => {
    item.index = (page - 1) * pageSize + index + 1
    if (item.member.length == 1 && item.member[0].id == null) {
      item.member = []
    }
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
  const { title, type, img, video, time, address } = req.body
  const connection = await dbConnect()
  //   time 2023-04-17T16:00:00.000Z
  // time转换成时间戳
  const date = new Date(time)
  const id = uuidv4()
  await connection.execute(
    'Insert into competition (id, title, type, img, video, time, address) values (?, ?, ?, ?, ?, ?, ?)',
    [id, title, type, img, video == undefined ? null : video, date, address]
  )
  res.status(200).json({
    message: '添加文章成功',
    code: 200,
  })
})

// 修改文章
router.post('/update', async (req, res) => {
  const { id, title, type, img, video, time, address } = req.body
  const connection = await dbConnect()
  await connection.execute(
    'Update competition set title = ?, type = ?, img = ?, video = ?, time = ?, address = ? where id = ?',
    [
      title,
      type,
      img,
      video == undefined ? null : video,
      new Date(time),
      address,
      id,
    ]
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
  await connection.execute('Delete from competition where id = ?', [id])
  res.status(200).json({
    message: '删除文章成功',
    code: 200,
  })
})

//报名
router.post('/signUp', async (req, res) => {
  const { parentId, name, email, studentId, mobile, remark } = req.body
  // 生成主键id和报名时间和number
  const id = uuidv4()
  const date = new Date()
  // number是由竞赛id后四位+年月日+学生id后四位组成
  const number =
    parentId.slice(-4) +
    date.getFullYear() +
    date.getMonth() +
    date.getDate() +
    studentId.slice(-4)
  const connection = await dbConnect()

  await connection.execute(
    'Insert into competitionmember (id, parentid, name, email, studentid, number, state, date, mobile, remarks) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      id,
      parentId,
      name,
      email,
      studentId,
      number,
      0,
      date,
      mobile,
      remark || '',
    ]
  )

  res.status(200).json({
    message: '报名成功',
    code: 200,
  })
})

export default router
