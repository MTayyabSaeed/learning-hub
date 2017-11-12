// -------------------------------------------
// Exposes a convenient global instance 
// -------------------------------------------
export default function html(ripple){
  log('creating')
  ripple.types['text/html'] = {
    header: 'text/html'
  , check(res){ return includes('.html')(res.name) }
  }

  return ripple
}

import includes from 'utilise/includes'
var log = require('utilise/log')('[ri/types/html]')