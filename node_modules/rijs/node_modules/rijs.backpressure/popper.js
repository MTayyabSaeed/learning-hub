#!/usr/bin/env node
var popper       = require('popper')
  , serve        = require('rijs.serve')
  , core         = require('rijs.core')
  , data         = require('rijs.data')
  , css          = require('rijs.css')
  , fn           = require('rijs.fn')
  , sync         = require('rijs.sync')
  , backpressure = require('./')
  
popper = popper({ 
  watch: ['src', 'test.js']
, port: 1945
, tests: tests()
, globals: globals() 
, browsers: browsers()
, ripple: ripple
})

popper.io.on('connection', function(socket){
  socket.on('beforeEach', function(){ 
    socket.deps = {}
    popper('array'       , [{i:0}, {i:1},{i:2}], headers())
    popper('some.css'    , '* { color: red }', headers())
    popper('shadow-el'   , shadowEl, headers())
    popper('my-component', component, headers())
    popper.sync(socket)()
    socket.emit('done')
  })
})

function ripple(server) { 
  return serve(server), backpressure(css(sync(data(fn(core())), server)))
}

function headers(argument) {
  return { silent: true, 'cache-control': 'no-cache' }
}

function globals(){
  return '<script src="https://cdn.polyfill.io/v1/polyfill.min.js"></script>'
       + '<script src="https://cdnjs.cloudflare.com/ajax/libs/chai/3.0.0/chai.min.js"></script>'
}

function component(data) {  }

function shadowEl(d){ this.innerHTML = '<my-component data="array" css="some.css"></my-component>' }

function from(val, body, key) {
  if (key != 'length') return;
  for (var i = 0; i < +val; i++) popper('proxy')[i] = { i: i }
  return true
}

function to(d) {
  return { sum: d.reduce(sum, 0), length: d.length }
}

function sum(p, v){ 
  return p + v.i
}

function browsers() {
  return [
  //   'ie11'
  // , 'chrome'
  // , 'firefox'
  ]
}

function tests() {
  return '(npm run build > /dev/null) && browserify ./test.js'
       + ' -i colors'
       + ' -i chai'
       + ' | sed -E "s/require\\(\'chai\'\\)/window.chai/"'
       + ' | uglifyjs'
}