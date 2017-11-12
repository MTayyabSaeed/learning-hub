// -------------------------------------------
// Extend Components with Features
// -------------------------------------------
export default function features(ripple){
  if (!client) return
  log('creating')
  ripple.render = render(ripple)(ripple.render)
  return ripple
}

const render = ripple => next => el => {
  const features = str(attr(el, 'is'))
          .split(' ')
          .map(from(ripple.resources))
          .filter(header('content-type', 'application/javascript'))
      , css = str(attr('css')(el)).split(' ')

  features
    .filter(by('headers.needs', includes('[css]')))
    .map(key('name'))
    .map(append('.css'))
    .filter(not(is.in(css)))
    .map(d => attr('css', (str(attr('css')(el)) + ' ' + d).trim())(el))

  const node = next(el)

  return !node || !node.state ? undefined
       : (features
          .map(key('body'))
          .map(d => d.call(node.shadowRoot || node, node.shadowRoot || node, node.state))
          , node)
}

const log = require('utilise/log')('[ri/features]')
import includes from 'utilise/includes'
import client from 'utilise/client'
import header from 'utilise/header'
import append from 'utilise/append'
import attr from 'utilise/attr'
import from from 'utilise/from'
import not from 'utilise/not'
import str from 'utilise/str'
import key from 'utilise/key'
import by from 'utilise/by'
import is from 'utilise/is'