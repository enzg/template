import Koa from 'koa'
import cors from '@koa/cors'
import { routes } from './routes'

const App = new Koa()
App.proxy = true
App
  .use(cors())
  .use(routes)
  .listen(43337, () => {
    console.log('server is on!!')
  })
