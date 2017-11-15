// -------------------------------------------
// Adds support for function resources
// -------------------------------------------
export default function fnc(ripple){
  log('creating')
  ripple.types['application/javascript'] = { header, check, parse, to }
  return ripple
}

const header = 'application/javascript'
const check = res => is.fn(res.body)
const parse = res => (res.body = fn(res.body), res)
const log   = require('utilise/log')('[ri/types/fn]')
const to    = res => (res.value = str(res.value), res)

import str from 'utilise/str'
import is from 'utilise/is'
import fn from 'utilise/fn'