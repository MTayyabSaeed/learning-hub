// -------------------------------------------
// Adds Shadow DOM Encapsulation into Rendering Pipeline
// -------------------------------------------
export default function shadow(ripple){
  if (!client) return;
  log('creating', document.head.createShadowRoot ? 'encapsulation' : 'closing gap')
  ripple.render = render(ripple.render)
  return ripple
}

const render = next => el => {
  el.createShadowRoot 
    ? (!el.shadowRoot && el.createShadowRoot() && (retarget(reflect(el))))
    : ( el.shadowRoot = el
      , el.shadowRoot.host = el)    

  return next(el)
}

const reflect = el => (
  (el.shadowRoot.innerHTML = el.innerHTML)
, (el.innerHTML = '')
, (el)
)

const retarget = el => keys(el)
  .concat(['on', 'once', 'emit', 'classList', 'getAttribute', 'setAttribute', 'hasAttribute', 'removeAttribute', 'closest'])
  .map(d => is.fn(el[d]) 
    ? (el.shadowRoot[d] = el[d].bind(el)) 
    : Object.defineProperty(el.shadowRoot, d, { 
        get: z => el[d] 
      , set: z => el[d] = z
      })
    )

const log = require('utilise/log')('[ri/shadow]')
    , err = require('utilise/err')('[ri/shadow]')

import client from 'utilise/client'
import keys from 'utilise/keys'
import is from 'utilise/is'