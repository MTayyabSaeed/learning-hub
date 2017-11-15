// -------------------------------------------
// Pipe resources to/from another source
// -------------------------------------------
export default function db(ripple, { db = {} } = {}){
  log('creating')
  ripple.on('change.db', crud(ripple))
  ripple.adaptors = ripple.adaptors || {}
  ripple.connections = keys(db)
    .map(k => connect(ripple)(k, db[k]))
    .reduce(to.obj, {})
  return ripple
}

const connect = ripple => (id, config) => {
  if (!config) return { id, invalid: err('no connection string', id) }

  is.str(config) && (config = {
    type    : (config = config.split('://')).shift()
  , user    : (config = config.join('://').split(':')).shift()
  , database: (config = config.join(':').split('/')).pop()
  , port    : (config = config.join('/').split(':')).pop()
  , host    : (config = config.join(':').split('@')).pop()
  , password: config.join('@')
  })

  if (values(config).some(not(Boolean))) 
    return { id, invalid: err('incorrect connection string', id, config) }

  const connection = (ripple.adaptors[config.type] || noop)(config)

  return connection 
       ? (connection.id = id, connection)
       : ({ id, invalid: err('invalid connection', id) })
}

const crud = ripple => (name, change) => {
  const { key, value, type } = change || {}
      , res = ripple.resources[name]
      
  if (!header('content-type', 'application/data')(res)) return
  if (header('silentdb')(res)) return delete res.headers.silentdb
  if (!type) return
  const updated = values(ripple.connections)
    .filter(con => con.change && con.change(type)(res, change))
    .map(d => d.id)

  if (updated.length) log('crud', type, name, updated.join(',').grey)
}

import header from 'utilise/header'
import values from 'utilise/values'
import noop from 'utilise/noop'
import keys from 'utilise/keys'
import not from 'utilise/not'
import is from 'utilise/is'
import to from 'utilise/to'
const err = require('utilise/err')('[ri/db]')
    , log = require('utilise/log')('[ri/db]')