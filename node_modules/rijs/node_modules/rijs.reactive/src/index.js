// -------------------------------------------
// API: React to data changes - deprecates explicit .emit('change')
// -------------------------------------------
export default function reactive(ripple){
  log('creating')
  ripple.on('change.reactive', react(ripple))
  return ripple
}

function react(ripple){
  return function(res){
    if (!is.obj(res.body)) return
    if (header('reactive', false)(res)) return
    if (res.body.observer) return
    if (!Object.observe) return polyfill(ripple)(res)

    Array.observe(
      res.body
    , def(res.body, 'observer', changed(ripple)(res))
    )
    
    is.arr(res.body) 
      && res.body.forEach(observe(ripple)(res))
  }
}

function observe(ripple) {
  return res => {
    return d => {
      if (!is.obj(d)) return
      if (d.observer) return
      var fn = child(ripple)(res)
      def(d, 'observer', fn)
      Object.observe(d, fn)
    }
  }
}

function child(ripple) {
  return res => {
    return changes => {
      var key = res.body.indexOf(changes[0].object)
        , value = res.body[key]
        , type = 'update'
        , change = { key, value, type }

      log('changed (c)'.green, res.name.bold, str(key).grey, debug ? changes : '')
      ripple.emit('change', [res, change], not(is.in(['reactive'])))
    }
  }
}

function changed(ripple) {
  return res => {
    return changes => {
      changes
        .map(normalize)
        .filter(Boolean)
        .map(change => (log('changed (p)'.green, res.name.bold, change.key.grey), change))
        .map(change => ((is.arr(res.body) && change.type == 'push' && observe(ripple)(res)(change.value)), change))
        .map(change => ripple.emit('change', [res, change], not(is.in(['reactive']))))
    }
  }
}

function polyfill(ripple) { 
  return function(res){
    if (!ripple.observer) ripple.observer = setInterval(check(ripple), 100)
    if (!ripple.cache) ripple.cache = {}
    ripple.cache[res.name] = str(res.body)
  }
}

function check(ripple) {
  return function(){
    if (!ripple || !ripple.resources) return clearInterval(ripple.observer)
    keys(ripple.cache)
      .forEach(function(name){
        var res = ripple.resources[name]
        if (ripple.cache[name] != str(res.body)){
          log('changed (x)', name)
          ripple.cache[name] = str(res.body)
          ripple.emit('change', [res], not(is.in(['reactive'])))
        }
      })
  }
}

// normalize a change
function normalize(change) {
  var type    = change.type
    , removed = type == 'delete' ? change.oldValue : change.removed && change.removed[0]
    , data    = change.object
    , key     = change.name || str(change.index)
    , value   = data[key]
    , skip    = type == 'update' && (str(value) == str(change.oldValue))
    , details = {
        key   : key
      , value : removed || value 
      , type  : type == 'update'             ? 'update'
              : type == 'delete'             ? 'remove'
              : type == 'splice' &&  removed ? 'remove'
              : type == 'splice' && !removed ? 'push'  
              : type == 'add'                ? 'push'  
              : false
      }

  if (skip) return log('skipping update'), false
  return details
}

import header from 'utilise/header'
import keys from 'utilise/keys'
import str from 'utilise/str'
import not from 'utilise/not'
import def from 'utilise/def'
import has from 'utilise/has'
import is from 'utilise/is'
var log = require('utilise/log')('[ri/reactive]')
  , err = require('utilise/err')('[ri/reactive]')
  , debug = false