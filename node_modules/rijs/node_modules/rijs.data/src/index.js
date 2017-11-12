// -------------------------------------------
// Adds support for data resources
// -------------------------------------------
export default function data(ripple){
  log('creating')
  ripple.on('change.data', trickle(ripple))
  ripple.types['application/data'] = {
    header: 'application/data'
  , check(res){ return is.obj(res.body) || !res.body ? true : false }
  , parse(res){ 
      const existing = ripple.resources[res.name] || {}

      extend(res.headers)(existing.headers)
      res.body = set()(
        res.body || []
      , existing.body && existing.body.log
      , is.num(res.headers.log) ? res.headers.log : -1
      )
      overwrite(res.body.on)(listeners(existing))
      res.body.on('change.bubble', change => {
        ripple.emit('change', ripple.change = [res.name, change], not(is.in(['data'])))
        delete ripple.change
      })
      
      return res
    }
  }

  return ripple
}

const trickle = ripple => (name, change) => header('content-type', 'application/data')(ripple.resources[name])
  && ripple
      .resources[name]
      .body
      .emit('change', [change || null], not(is.in(['bubble'])))

import overwrite from 'utilise/overwrite'
import header from 'utilise/header'
import extend from 'utilise/extend'
import not from 'utilise/not'
import key from 'utilise/key'
import set from 'utilise/set'
import is from 'utilise/is'
const log = require('utilise/log')('[ri/types/data]')
    , listeners = key('body.on')