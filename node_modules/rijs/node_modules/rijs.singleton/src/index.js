// -------------------------------------------
// Exposes a convenient global instance 
// -------------------------------------------
export default function singleton(ripple){
  log('creating')
  if (!owner.ripple) owner.ripple = ripple
  return ripple
}

import owner from 'utilise/owner'
var log = require('utilise/log')('[ri/singleton]')