import { Express, Request, Response, Router } from 'express'
import registerRouter from './register.routes'

// 路由配置
interface RouterConf {
  path: string
  router: Router
  meta?: unknown
}

const routerConf: Array<RouterConf> = [
  {
    path: '/api/register',
    router: registerRouter,
  },
]

const getInfo = function () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      Math.random() > 0.5 ? resolve('info...') : reject('error...')
    }, 500)
  })
}

function routes(app: Express) {
  app.get('/', async (req: Request, res: Response) => {
    const info = await getInfo()
    res.send(info)
  })

  routerConf.forEach((conf) => app.use(conf.path, conf.router))
}

export default routes
