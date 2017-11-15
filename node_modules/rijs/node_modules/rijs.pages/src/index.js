// -------------------------------------------
// Serves the /pages directory
// -------------------------------------------
export default function pages(ripple, { server, dir } = {}){
  log('creating')
  server = ripple.server || server
  if (!server || !dir) return ripple
  expressify(server)
    .use(serve(resolve(dir, './pages')))
  return ripple
}

const expressify = server => server.express
  || key('_events.request')(server) 
  || server.on('request', express())._events.request

import key from 'utilise/key'
import { resolve } from 'path'
import express from 'express'
import serve from 'serve-static'
const log = require('utilise/log')('[ri/pages]')