import { Express, Request, Response, Router } from 'express'
import registerRouter from './register.routes'
import forgotPasswordRouter from './forgotPassword.routes'
import loginRouter from './login.routes'
import changePasswordRouter from './changePassword.routes'
import userInfo from './userInfo.routes'
import fileRouter from './file.routes'
import updateUserInfo from './updateUserInfo.routes'
import officialNewsInfo from './officialNewsInfo.routes'
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
  {
    path: '/api/forgotPassword',
    router: forgotPasswordRouter,
  },
  {
    path: '/api/login',
    router: loginRouter,
  },
  {
    path: '/api/changePassword',
    router: changePasswordRouter,
  },
  {
    path: '/api/userInfo',
    router: userInfo,
  },
  {
    path: '/api/file',
    router: fileRouter,
  },
  {
    path: '/api/updateUserInfo',
    router: updateUserInfo,
  },
  {
    path: '/api/officialNewsInfo',
    router: officialNewsInfo,
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
