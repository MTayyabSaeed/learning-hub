// -------------------------------------------
// Synchronises resources between server/client
// -------------------------------------------
export default function sync(ripple, { server, port } = {}){
  log('creating')
  if (!client) { 
    ripple.to = clean(ripple.to)
    values(ripple.types).map(type => type.parse = headers(ripple)(type.parse))
    server = def(ripple, 'server', server || express().listen(port, d => log('listening', server.address().port)))
    server.express = key('_events.request')(server) || server.on('request', express())._events.request
  }

  def(ripple, 'io', io(server))
  ripple.io.use(ip)
  ripple.req = send(ripple)(ripple)
  ripple.send = client ? send(ripple)(ripple.io) : send(ripple)
  ripple.on('change.send', broadcast(ripple))
  ripple.io.on('change', consume(ripple))
  ripple.io.on('connection', connected(ripple))
  return ripple
}

const connected = ripple => socket => {
  log('connected'.green, str(socket.ip).grey) 
  socket.on('change', consume(ripple))
  ripple.send(socket)()
}

const broadcast = ripple => (name, change) => {
  (client ? ripple.send : ripple.send())
    (extend({ name })(change || {}))
}

const normalize = (ripple, next = identity) => (name, type, value) => {
  let req = is.obj(name) ? name : { name, type, value }
    , resource = ripple.resources[req.name]

  if (!req.name)
    return next(values(ripple.resources).map(normalize(ripple)))

  // if (!resource)
  //   return Promise.resolve([404, err(`cannot find ${req.name}`)])
  
  if (!req.type)
    req = {
      name   : req.name
    , type   : 'update'
    , headers: resource.headers
    , value  : resource.body
    , time   : now(resource)
    }

  if (req.type == 'update' && !req.key)
    req.headers = resource.headers

  return next(req)
}

// send all or some req, to all or some sockets
const send = (ripple, l = log) => who => normalize(ripple, req => {
  const count    = sent => `${str(sent.length).green.bold}/${str(everyone.length).green}`
      , all      = d => req.length && log('send'.grey, count(sockets), 'all'.bold, `(${req.length})`.grey)
      , everyone = client ? [ripple.io] : values(ripple.io.of('/').sockets)
      , sockets  = is.arr(who) ? who
                 : is.str(who) ? everyone.filter(by('sessionID', who))
                 : !who        ? everyone
                               : [who]
      , promises = is.arr(req) ? (all(), req.map(send(ripple, l = noop)(sockets)))
                 : sockets.map(s => to(ripple, req, s)).filter(Boolean)

  if (promises.length) l('send'.grey, count(promises), req.name)
  return Promise.all(promises)
})

// outgoing transforms
const to = (ripple, req, socket, resource) => {
  if (header('silent', socket)(resource = ripple.resources[req.name]))
    return delete resource.headers.silent, false

  const nametype = `(${req.name}, ${req.type})`
      , xres = header('to')(resource)    || identity
      , xtyp = type(ripple)(resource).to || identity
      , xall = ripple.to                 || identity
      , p    = promise()

  Promise.resolve(xall(extend({ socket })(req)))
    .then(req => req && xtyp(req))
    .then(req => req && xres(req))
    .then(req => 
      !strip(req)      ? p.resolve([false])
    : socket == ripple ? consume(ripple)(req, res)
                       : socket.emit('change', req, res))
    .catch(e => { throw new Error(err('to failed'.red, e)) })

  return p

  function res() { 
    deb('ack'.grey, nametype, str(socket.ip).grey)
    p.resolve(arr(arguments))
  }
}

// incoming transforms
const consume = ripple => function(req, res = noop) {
  const nametype = `(${req.name}, ${req.type})`
      , resource = ripple.resources[req.name]
      , silent   = silence(req.socket = this)
      , xres     = header('from')(resource)    || identity
      , xtyp     = type(ripple)(resource).from || identity
      , xall     = ripple.from                 || identity

  log('recv'.grey, nametype)
  try { 
    ( !req.name                        ? res(404, err('not found'.red, req.name))
    : !(req = xall(req, res))          ? deb('skip', 'global'  , nametype)
    : !(req = xtyp(req, res))          ? deb('skip', 'type'    , nametype)
    : !(req = xres(req, res))          ? deb('skip', 'resource', nametype)
    : !req.key && req.type == 'update' ? (ripple(silent(body(req)))
                                       , res(200, deb(`ok ${nametype}`)))
    :  isStandardVerb(req.type)        ? (set(req)(silent(resource).body)
                                       , res(200, deb(`ok ${nametype}`, key.grey)))
    : !isStandardVerb(req.type)        ? res(405, deb('method not allowed', nametype))
                                       : res(400, deb('cannot process', nametype)))
  } catch (e) {
    res(e.status || 500, err(e.message, nametype, '\n', e.stack))
  }
}

const body = ({ name, body, value, headers }) => ({ name, headers, body: value })

const headers = ripple => next => res => {
  const existing = ripple.resources[res.name]
      , from = header('from')(res) || header('from')(existing)
      , to   = header('to')(res)   || header('to')(existing)
  if (from) res.headers.from = from
  if (to)   res.headers.to   = to
  return next ? next(res) : res
}

const io = server => {
  const transports = client 
  && document.currentScript
  && document.currentScript.getAttribute('transports')
  && document.currentScript.getAttribute('transports').split(',')
  || undefined

  const r = !client ? require('socket.io')(server)
          : window.io ? window.io({ transports })
          : is.fn(require('socket.io-client')) ? require('socket.io-client')({ transports })
          : { on: noop, emit: noop }
  r.use = r.use || noop
  return r
}

const ip = (socket, next) => {
  socket.ip = socket.request.headers['x-forwarded-for'] 
           || socket.request.connection.remoteAddress
  next()
}

const strip = req => (delete req.socket, req)

const clean = next => (req, res) => {
  if (is.obj(req.value))
    try { req.value = clone(req.value) } catch (e) { 
      err('cannot send circular structure') 
      return false
    }

  if (!req.headers || !req.headers.silent) 
    return (next || identity)(req, res)
  
  const stripped = {}

  keys(req.headers)
    .filter(not(is('silent')))
    .map(header => stripped[header] = req.headers[header])

  req.headers = stripped
  return (next || identity)(req, res)
}

import express from 'express'
import identity from 'utilise/identity'
import promise from 'utilise/promise'
import values from 'utilise/values'
import extend from 'utilise/extend'
import header from 'utilise/header'
import client from 'utilise/client'
import clone from 'utilise/clone'
import noop from 'utilise/noop'
import keys from 'utilise/keys'
import not from 'utilise/not'
import str from 'utilise/str'
import set from 'utilise/set'
import def from 'utilise/def'
import key from 'utilise/key'
import by from 'utilise/by'
import is from 'utilise/is'
import { arr } from 'utilise/to'

const type = ripple => res => ripple.types[header('content-type')(res)] || {}
    , now = (d, t) => (t = key('body.log.length')(d), is.num(t) ? t - 1 : t)
    , silence = socket => res => key('headers.silent', socket)(res)
    , isStandardVerb = is.in(['update', 'add', 'remove'])
    , log = require('utilise/log')('[ri/sync]')
    , err = require('utilise/err')('[ri/sync]')
    , deb = require('utilise/deb')('[ri/sync]')