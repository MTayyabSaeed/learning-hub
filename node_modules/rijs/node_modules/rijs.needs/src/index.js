// -------------------------------------------
// Define Default Attributes for Components
// -------------------------------------------
export default function needs(ripple){
  if (!client) return;
  log('creating')
  ripple.render = render(ripple)(ripple.render)
  return ripple
}

const render = ripple => next => el => {
  const component = lo(el.nodeName)
  if (!(component in ripple.resources)) return
    
  const headers = ripple.resources[component].headers
      , attrs = headers.attrs = headers.attrs || parse(headers.needs, component)

  return attrs
    .map(([name, values]) => values.some((v, i) => {
      const from = attr(el, name) || ''
      return includes(v)(from) ? false
           : attr(el, name, (from + ' ' + v).trim())
    }))
    .some(Boolean) ? el.draw() : next(el)
}

const parse = (attrs = '', component) => attrs
  .split('[')
  .slice(1)
  .map(replace(']', ''))
  .map(split('='))
  .map(([k, v]) => 
      v          ? [k, v.split(' ')]
    : k == 'css' ? [k, [component + '.css']]
                 : [k, []]
  )

const log = require('utilise/log')('[ri/needs]')
    , err = require('utilise/err')('[ri/needs]')
import includes from 'utilise/includes'
import replace from 'utilise/replace'
import client from 'utilise/client'
import split from 'utilise/split'
import attr from 'utilise/attr'
import key from 'utilise/key'
import lo from 'utilise/lo'