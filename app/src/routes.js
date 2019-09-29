import Router from 'koa-router'
import { Cfg } from './config'
import QRCode from 'qrcode'

const router = new Router()


const mem = {}
router.get('/ping', async ctx => {
  ctx.body = 'pong'
})
// for client apk to load parent info
router.get('/parent', async ctx => {
  // get client ip
  const clientIP = ctx.request.ip
  // const parent = await db.get(clientIP).catch(err => {
  //   console.log(`${clientIP} lookup failed,${err}`)
  //   Promise.resolve({
  //     parentId: -1
  //   })
  // })
  ctx.body = {
    parentId: mem[clientIP] || -1
  }
  // lookup db for parent id
})
router.get('/qc/:cat/:parent', async ctx => {
  const url = `${Cfg.host}/download/${ctx.params.cat}/${ctx.params.parent}`
  const opt = {
    width: 152,
  }
  ctx.body = await QRCode.toDataURL(url, opt)
})
router.get('/download', async ctx => {
  // record parentId and client ip to db
  // redirect to the apk url
  const clientIP = ctx.request.ip
  const parentId = ctx.params.parent || -1
  const cat = ctx.params.cat || 'player'
  mem[clientIP] = parentId
  ctx.redirect(Cfg[cat]['apk'])
})

export const routes = router.routes()
