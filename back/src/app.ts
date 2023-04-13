import express from 'express'
import routes from './routes'
import config from './config/default'
import dbConnect from './utils/dbConnect'
import initMiddleware from './middleware'

const app = express()

// 初始化中间件
initMiddleware(app)

const PORT = config.port

// 启动
app.listen(PORT, async () => {
  // 路由配置
  routes(app)
})
