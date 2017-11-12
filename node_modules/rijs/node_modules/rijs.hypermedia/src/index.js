// -------------------------------------------
// Enables following hypermedia links
// -------------------------------------------
export default function hypermedia(ripple){
  log('creating')
  ripple.on("change.hypermedia", trickle(ripple))
  ripple.types['application/hypermedia'] = {
    header: 'application/hypermedia'
  , render: key('types.application/data.render')(ripple)
  , priority: 10
  , check(res) { 
      return header('content-type', 'application/hypermedia')(ripple.resources[res.name]) 
          || isURL(res.body) 
          || parent(ripple)(res.headers.link)
          || (parent(ripple)(res.name) && !includes('.css')(res.name))
    }
  , parse(res) { 
      var name = res.name
        , body = res.body
        , nearest = parent(ripple)(name)
        , sup = ripple.types['application/data'].parse
        , register = r => ripple({ name, body })
        , isLoaded = loaded(ripple)
        , timestamp = new Date()

      if (isLoaded(name)()) return sup(res)

      if (res.headers.link) 
        return ripple(res.headers.link, res.body)
                 .once('change', wait(isLoaded(res.headers.link))(r => ripple(name, r, { timestamp })))
             , sup(res)

      if (isURL(res.body)) 
        res.headers.url = res.body

      if (nearest && ripple.resources[nearest].headers.http) 
        res.headers.http = ripple.resources[nearest].headers.http
      
      if (!is.obj(res.body)) 
        res.body = {}

      if (res.headers.url) 
        return request(opts(res.headers.url, res.headers.http), fetched(ripple)(res)), sup(res)

      if (nearest && !ripple.resources[nearest].headers.timestamp) 
        return ripple(nearest).once('change', wait(isLoaded(nearest))(register))
             , debug('parent not loaded yet')
             , sup(res) 
      
      if (nearest) { 
        var parts = subtract(name, nearest)
          , value
          
        for (var i = 1; i < parts.length+1; i++) { 
          var path = parts.slice(0, i).join('.')
            , next = [nearest, path].join('.')
          value = key(path)(ripple(nearest))

          if (isURL(value)) {
            ripple(next, expand(value, res.body))
            if (next != name) ripple(next).once('change', wait(isLoaded(nearest))(register))
            return debug('loading link'), sup(res)
          }
        }

        res.headers.timestamp = timestamp
        res.body = is.obj(value) ? value : { value }
        log('loaded'.green, name)
        return sup(res)
      }

      return sup(res)

    }
  }

  return ripple
}

import includes from 'utilise/includes'
import header from 'utilise/header'
import extend from 'utilise/extend'
import parse from 'utilise/parse'
import wait from 'utilise/wait'
import noop from 'utilise/noop'
import keys from 'utilise/keys'
import key from 'utilise/key'
import not from 'utilise/not'
import is from 'utilise/is'
import fn from 'utilise/fn'
import to from 'utilise/to'
import request from 'request'
var log = require('utilise/log')('[ri/hypermedia]')
  , err = require('utilise/err')('[ri/hypermedia]')
  , debug = noop

function expand(url, params) {
  keys(params)
    .map(k => {
      url = url.replace(`{${k}}`, params[k])
      url = url.replace(`{/${k}}`, '/' + params[k])
    })

  url = url.replace(/\{.+?\}/g, '')
  debug('url', url)
  return url
}

function parent(ripple){
  return function(key){
    if (!key) return false
    var parts = key.split('.') 
    for (var i = parts.length - 1; i > 0; i--) {
      var candidate = parts.slice(0, i).join('.')
      if (candidate in ripple.resources) return candidate
    }
  }
}

function subtract(a, b){
  return a.slice(b.length+1).split('.')
}

function loaded(ripple){
  return name => r => ripple.resources[name] && ripple.resources[name].headers.timestamp
}

function isURL(d) {
  return includes('://')(d) 
}

function opts(url, headers){
  return { url, headers: extend({ 'User-Agent': 'request' })(headers) }
}

function fetched(ripple){
  return function(res, url){ 
    return function(e, response, body) {
      body = parse(body)
      if (e) return err(e, url)
      if (response.statusCode != 200) return err(body.message, url)
      debug('fetched', res.name)
      ripple.resources[res.name].headers.timestamp = new Date()
      ripple(res.name, body)
    }
  }
}

const trickle = ripple => (name, change) => 
  header('content-type', 'application/hypermedia')(ripple.resources[name]) && 
    ripple
      .resources[name]
      .body
      .emit('change', [change || null], not(is.in(['bubble'])))