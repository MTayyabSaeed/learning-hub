// -------------------------------------------
// Serves the client library /ripple.js
// -------------------------------------------
export default function serve(ripple, { server, serve = __dirname } = {}){
  log('creating')
  server = ripple.server || server
  if (!server) return ripple
  const app  = expressify(server)
      , path = local(serve)
      , compress = compression()

  app.use('/ripple.js', compress, send(path('js')))
  app.use('/ripple.min.js', compress, send(path('min.js')))
  app.use('/ripple.pure.js', compress, send(path('pure.js')))
  app.use('/ripple.pure.min.js', compress, send(path('pure.min.js')))
  return ripple
}

const expressify = server => server.express
  || key('_events.request')(server) 
  || server.on('request', express())._events.request

const local = path => ext => resolve(path, './ripple.' + ext)

import compression from 'compression'
import send from 'utilise/send'
import key from 'utilise/key'
import { resolve } from 'path'
import express from 'express'
const log = require('utilise/log')('[ri/serve]')