import { Router } from 'express'
import dbConnect from '../utils/dbConnect'

const router = Router()

router.get('/', async (req, res) => {
  const { page, pageSize, studentId, name }: any = req.query
  const where: any = []
  if (name) {
    where.push(`name like '%${name}%'`)
  }
  if (studentId) {
    where.push(`studentId = '${studentId}'`)
  }
  const connection = await dbConnect()
  //   competitionmember 连接主表 competition
  const [rows, fields] = await connection.execute(
    `Select competitionmember.*, competition.title, competition.type,competition.time, competition.address from competitionmember left join competition on competitionmember.parentid = competition.id ${
      where.length > 0 ? 'where ' + where.join(' and ') : ''
    } order by time desc limit ${(page - 1) * pageSize}, ${pageSize}`
  )
  const [count, fields2] = await connection.execute(
    `Select count(*) as count from competitionmember ${
      where.length > 0 ? 'where ' + where.join(' and ') : ''
    }`
  )
  const list: any = rows
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

//删除
router.delete('/delete', async (req, res) => {
  const { id } = req.body
  const connection = await dbConnect()
  await connection.execute('Delete from competitionmember where id = ?', [id])
  res.status(200).json({
    message: '删除成功',
    code: 200,
  })
})

// 打分
router.post('/grade', async (req, res) => {
  const { id, grade, parentId } = req.body
  const connection = await dbConnect()
  await connection.execute(
    'Update competitionmember set grade = ? where id = ?',
    [grade, id]
  )
  console.log('parentId', parentId)
  // 根据parentId查询所有成员的成绩，并更新排名
  const [rows, fields] = await connection.execute(
    'Select * from competitionmember where parentid = ?',
    [parentId]
  )
  const list: any = rows
  list.sort((a, b) => {
    return b.grade - a.grade
  })
  list.forEach((item, index) => {
    item.rank = index + 1
  })
  // 更新排名
  list.forEach(async (item) => {
    await connection.execute(
      'Update competitionmember set rank = ? where id = ?',
      [item.rank, item.id]
    )
  })
  res.status(200).json({
    message: '打分成功',
    code: 200,
  })
})

//高分榜
router.get('/highScore', async (req, res) => {
  const { page, pageSize }: any = req.query
  const connection = await dbConnect()
  const [rows, fields] = await connection.execute(
    `Select competitionmember.*, competition.title, competition.type,competition.time, competition.address from competitionmember left join competition on competitionmember.parentid = competition.id order by grade desc limit ${
      (page - 1) * pageSize
    }, ${pageSize}`
  )
  const [count, fields2] = await connection.execute(
    `Select count(*) as count from competitionmember`
  )
  const list: any = rows
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

//获得比赛参与人数统计
router.get('/competitionApplyCount', async (req, res) => {
  // 获取比赛名称和参与人数
  const connection = await dbConnect()
  const [rows, fields] = await connection.execute(
    `Select competition.title, count(*) as count from competitionmember left join competition on competitionmember.parentid = competition.id group by competitionmember.parentid`
  )
  const list: any = rows
  res.status(200).json({
    message: '获取文章列表成功',
    code: 200,
    data: {
      list: list,
    },
  })
})

export default router
