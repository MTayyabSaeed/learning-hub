// -------------------------------------------
// API: Delays the rendering of a component [delay=ms]
// -------------------------------------------
export default function delay(ripple){
  if (!client) return ripple;
  log('creating')
  ripple.render = render(ripple.render)
  return ripple
}

const render = next => el => { 
  const delay = attr('delay')(el)
  return delay != null
    ? ( attr('inert', '')(el)
      , attr('delay', false)(el)
      , time(+delay, d => (attr('inert', false)(el), el.draw()))
      )
    : next(el)
}

const log = require('utilise/log')('[ri/delay]')
    , err = require('utilise/err')('[ri/delay]')

import client from 'utilise/client'
import attr from 'utilise/attr'