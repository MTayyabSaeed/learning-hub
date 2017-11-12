// -------------------------------------------
// Applies backpressure on the flow of streams
// -------------------------------------------
export default function backpressure(ripple){
  log('creating')
  if (!ripple.io) return ripple
  if (client) {
    ripple.render    = render(ripple)(ripple.render)
    ripple.pull      = pull(ripple)
    ripple.deps      = deps
    ripple.requested = {}
    ripple.io.on('connect', refresh(ripple))
    ripple.io.on('reconnect', reconnect(ripple))
    ready(start(ripple))
    return ripple
  }

  ripple.to = limit(ripple.to)
  ripple.from = track(ripple)(ripple.from)
  ripple.io.use((socket, next) => { socket.deps = {}, next() })
  return ripple
}

const start = ripple => d => scan(ripple)(document.body)

const scan = ripple => el => !el ? undefined : (all('*', el)
  .filter(by('nodeName', includes('-')))
  .filter(by('nodeName', d => !is.in(ripple.requested)(lo(d))))
  .map(ripple.draw), el)

const track = ripple => next => (req, res) => { 
  const { name, type, socket } = req
      , { send } = ripple
      , exists = name in socket.deps

  if (!(name in ripple.resources)) return
  if (type === 'pull') {
    socket.deps[name] = 1
    send(socket)(name)
  }
  return (next || identity)(req, res)
}

const reconnect = ({ io }) => d => (io.io.disconnect(), io.io.connect())

const refresh = ripple => d => group('refreshing', d =>
  values(ripple.resources)
    .map(d => d.name)
    .map(ripple.pull))

const pull = ripple => (name, node) => {
  if (node instanceof Element) {
    const original = attr('data')(node) || ''     
    if (!original.split(' ').some(is(name)))
      attr('data', `${original} ${name}`.trim())(node)
  }

  if (!(name in ripple.requested)) {
    log('pulling', name)
    ripple.requested[name] = ripple.send({ name, type: 'pull' })
  } 

  return name in ripple.resources 
       ? promise(ripple(name))
       : ripple.requested[name]
}


const limit = next => req => 
    req.name in req.socket.deps
  ? (next || identity)(req)
  : false

const deps = el => format([ 
    key('nodeName')
  , attr('data')
  , attr('css')
  , attr('is')
  ])(el)

const format = arr => el => arr
  .map(extract => extract(el))
  .filter(Boolean)
  .map(lo)
  .map(split(' '))
  .reduce(flatten, [])
  .filter(unique)

const render = ripple => next => el => ripple.deps(el)
  .filter(not(is.in(ripple.requested)))
  .map(ripple.pull)
  .length ? false : scan(ripple)(next(el))

import { default as from } from 'utilise/from'
import includes from 'utilise/includes'
import identity from 'utilise/identity'
import flatten from 'utilise/flatten'
import unique from 'utilise/unique'
import values from 'utilise/values'
import client from 'utilise/client'
import ready from 'utilise/ready'
import group from 'utilise/group'
import split from 'utilise/split'
import attr from 'utilise/attr'
import noop from 'utilise/noop'
import not from 'utilise/not'
import all from 'utilise/all'
import key from 'utilise/key'
import is from 'utilise/is'
import by from 'utilise/by'
import lo from 'utilise/lo'
const log = require('utilise/log')('[ri/back]')
    , err = require('utilise/err')('[ri/back]')
