// -------------------------------------------
// Exposes a convenient global instance 
// -------------------------------------------
export default function css(ripple){
  log('creating')
  ripple.types['text/css'] = {
    header: 'text/css'
  , check(res){ return includes('.css')(res.name) }
  }

  return ripple
}

import includes from 'utilise/includes'
var log = require('utilise/log')('[ri/types/css]')