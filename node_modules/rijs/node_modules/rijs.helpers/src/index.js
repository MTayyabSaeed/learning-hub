// -------------------------------------------
// Attach Helper Functions for Resources
// -------------------------------------------
export default function helpers(ripple){
  log('creating')

  const type = ripple.types['application/data']
  type.parse = attach(type.parse)
  if (!client) type.to = serialise(type.to)
  return ripple
}

const attach = next => res => {
  if (next) res = next(res)
  const helpers = res.headers.helpers

  keys(helpers)
    .map(name => (helpers[name] = fn(helpers[name]), name))
    .map(name => def(res.body, name, helpers[name]))

  return res
}

const serialise = next => req => {
  if (!req.headers) return (next || identity)(req)

  const { helpers } = req.headers

  keys(helpers)
    .filter(name => is.fn(helpers[name]))
    .map(name => helpers[name] = str(helpers[name]))

  return (next || identity)(req)
}

const log = require('utilise/log')('[ri/helpers]')
import identity from 'utilise/identity'
import client from 'utilise/client'
import values from 'utilise/values'
import keys from 'utilise/keys'
import def from 'utilise/def'
import str from 'utilise/str'
import by from 'utilise/by'
import is from 'utilise/is'
import fn from 'utilise/fn'