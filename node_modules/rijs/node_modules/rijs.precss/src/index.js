// -------------------------------------------
// Pre-applies Scoped CSS [css=name]
// -------------------------------------------
export default function precss(ripple){
  if (!client) return;
  log('creating')
  
  ripple.render = render(ripple)(ripple.render)

  values(ripple.types)
    .filter(by('header', 'text/css'))
    .map(type => type.render = proxy(type.render, css(ripple)))

  return ripple
}

const render = ripple => next => host => {
  var css = str(attr(host, 'css')).split(' ').filter(Boolean)
    , root = host.shadowRoot || host
    , head = document.head
    , shadow = head.createShadowRoot && host.shadowRoot
    , styles

  // this host does not have a css dep, continue with rest of rendering pipeline
  if (!css.length) return next(host)
  
  // this host has a css dep, but it is not loaded yet - stop rendering this host
  if (css.some(not(is.in(ripple.resources)))) return;

  // retrieve styles
  styles = css
    .map(from(ripple.resources))
    .map(d => d.body)
    .map(shadow ? identity : transform(css))

  // reuse or create style tag
  css
    .map(d => raw(`style[resource="${d}"]`, shadow ? root : head) || el(`style[resource=${d}]`))
    .map((d, i) => (d.innerHTML = styles[i], d))
    .filter(not(by('parentNode')))
    .map(d => shadow ? root.insertBefore(d, root.firstChild) : head.appendChild(d))

  // continue with rest of the rendering pipeline
  return next(host)
}

const transform = names => (styles, i) => scope(styles, '[css~="' + names[i] + '"]')

const css = ripple => res => 
  all(`[css~="${res.name}"]:not([inert])`)
    .map(ripple.draw)

import identity from 'utilise/identity'
import client from 'utilise/client'
import values from 'utilise/values'
import proxy from 'utilise/proxy'
import attr from 'utilise/attr'
import from from 'utilise/from'
import all from 'utilise/all'
import raw from 'utilise/raw'
import str from 'utilise/str'
import not from 'utilise/not'
import by from 'utilise/by'
import is from 'utilise/is'
import el from 'utilise/el'
import scope from 'cssscope'
const log = require('utilise/log')('[ri/precss]')
    , err = require('utilise/err')('[ri/precss]')