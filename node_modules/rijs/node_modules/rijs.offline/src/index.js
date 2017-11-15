// -------------------------------------------
// API: Cache to and Restore from localStorage
// -------------------------------------------
export default function offline(ripple){
  if (!client || !window.localStorage) return;
  log('creating')
  load(ripple)
  ripple.on('change.cache', debounce(1000)(cache(ripple)))
  return ripple
}

const load = ripple => group('loading cache', d => 
  (parse(localStorage.ripple) || [])
    .map(ripple))

const cache = ripple => res => {
  log('cached')
  const cachable = values(clone(ripple.resources))
    .filter(not(header('cache', 'no-store')))

  cachable
    .filter(header('content-type', 'application/javascript'))
    .map(d => d.body = str(ripple.resources[d.name].body) )

  localStorage.ripple = str(cachable)
}

import debounce from 'utilise/debounce'
import header from 'utilise/header'
import client from 'utilise/client'
import values from 'utilise/values'
import clone from 'utilise/clone'
import parse from 'utilise/parse'
import group from 'utilise/group'
import not from 'utilise/not'
import str from 'utilise/str'
const log = require('utilise/log')('[ri/offline]')
    , err = require('utilise/err')('[ri/offline]')