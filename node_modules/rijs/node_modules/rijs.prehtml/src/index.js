// -------------------------------------------
// API: Pre-applies HTML Templates [template=name]
// -------------------------------------------
export default function prehtml(ripple){
  if (!client) return;
  log('creating')
  
  var render = ripple.render

  key('types.text/html.render', wrap(html(ripple)))(ripple)

  ripple.render = function(el){
    var div, html = attr(el, 'template')
    if (!html) return render.apply(this, arguments)
    if ( html && !ripple(html)) return;
    div = document.createElement('div')
    div.innerHTML = ripple(html)
    ;(el.shadowRoot || el).innerHTML = div.innerHTML
    return render(el)
  }

  return ripple
}

function html(ripple) {
  return res => {
    return all(`[template="${res.name}"]:not([inert])`)
      .map(ripple.draw)
  }
}

import client from 'utilise/client'
import attr from 'utilise/attr'
import wrap from 'utilise/wrap'
import all from 'utilise/all'
import key from 'utilise/key'
var log = require('utilise/log')('[ri/prehtml]')
  , err = require('utilise/err')('[ri/prehtml]')