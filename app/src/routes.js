import Router from 'koa-router'
import { Cfg } from './config'
import level from 'level'
import QRCode from 'qrcode'

const router = new Router()
const db = level('yibo')

router.get('/ping', async ctx => {
  ctx.body = 'pong'
})
// for client apk to load parent info
router.get('/parent', async ctx => {
  // get client ip
  const clientIP = ctx.request.ip
  const parent = await db.get(clientIP).catch(err => {
    console.log(`${clientIP} lookup failed,${err}`)
    Promise.resolve({
      parentId: -1
    })
  })
  ctx.body = {
    parentId: parent
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
router.get('/download/:cat/:parent', async ctx => {
  // record parentId and client ip to db
  // redirect to the apk url
  const clientIP = ctx.request.ip
  const parentId = ctx.params.parent || -1
  const cat = ctx.params.cat || 'player'
  await db.put(clientIP, parentId).catch(err => {
    console.log(`save ${clientIP} failed ${err}`)
  })
  console.log(Cfg[cat]['apk'])
  ctx.redirect(Cfg[cat]['apk'])
})

export const routes = router.routes()
