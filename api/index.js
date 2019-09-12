#!/usr/bin/env node

const Koa = require('koa')
const Subdomain = require('koa-subdomain')
const Router = require('koa-router')

const app = new Koa()
const subdomain = new Subdomain()
const router = new Router()

const isDev = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development')

if (isDev) {
  app.subdomainOffset = 1
}

router.get('*', async (ctx) => {
  const { wildcardSubdomains: subdomains } = ctx.state
  const subdomain = subdomains.join('.')

  ctx.body = { subdomain }
})

// identifier.domain.com
subdomain.use('*', router.routes())

app.use(subdomain.routes())

if (!process.env.NOW_REGION) {
  const port = process.env.PORT || 3000
  const server = app.listen(port, () => {
    console.info(`Server up @ http://localhost:${port}`)
  })

  process.on('SIGINT', () => server.close())
  process.on('SIGTERM', () => server.close())
}

module.exports = app.callback()
