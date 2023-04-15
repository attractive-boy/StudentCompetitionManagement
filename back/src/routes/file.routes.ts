import { Router } from 'express'
import dbConnect from '../utils/dbConnect'
import jwt from 'jsonwebtoken'
import multer from 'multer'
// uuid
import { v4 as uuidv4 } from 'uuid'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })
router.post('/upload', upload.single('file'), async (req: any, res) => {
  const { mimetype, size, buffer, originalname } = req.file
  const connection = await dbConnect()
  const id = uuidv4()
  await connection.execute(
    'Insert into file (id, mimetype, size, file, originalname) values (?, ?, ?, ?, ?)',
    [id, mimetype, size, buffer, originalname]
  )
  //返回文件信息
  res.status(200).json({
    message: '上传成功',
    code: 200,
    url: `/api/file/download/${id}`,
    data: {
      id,
      originalname,
      mimetype,
      size,
    },
  })
})

//上传多个文件
router.post('/uploads', upload.array('files'), async (req: any, res) => {
  const { files } = req
  const connection = await dbConnect()
  const result: any = []
  const ids: string[] = []
  for (let i = 0; i < files.length; i++) {
    const { mimetype, size, buffer, originalname } = files[i]
    const id = uuidv4()
    ids.push(id)
    await connection.execute(
      'Insert into file (id, mimetype, size, file, originalname) values (?, ?, ?, ?, ?)',
      [id, mimetype, size, buffer, originalname]
    )
    result.push({
      id,
      originalname,
      mimetype,
      size,
    })
  }
  //返回文件信息
  res.status(200).json({
    message: '上传成功',
    code: 200,
    urls: ids.map((id) => `/api/file/download/${id}`),
    data: result,
  })
})

router.get('/download/:id', async (req, res) => {
  const { id } = req.params
  const connection = await dbConnect()
  const [rows, fields] = await connection.execute(
    'Select * from file where id = ?',
    [id]
  )
  if (rows[0] && rows[0].id === id) {
    console.log(rows[0].mimetype)
    res.set('Content-Type', rows[0].mimetype)
    res.send(rows[0].file)
  } else {
    res.status(200).json({
      message: '文件不存在',
      code: 400,
    })
  }
})

export default router
