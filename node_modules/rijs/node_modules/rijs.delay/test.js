var expect     = require('chai').expect
  , client     = require('utilise/client')
  , time       = require('utilise/time')
  , once       = require('utilise/once')
  , components = require('rijs.components').default
  , core       = require('rijs.core').default
  , fn         = require('rijs.fn').default
  , delay      = require('./').default
  , container
  , el1, el2

describe('Delay Render', function() {

  before(function(){
    /* istanbul ignore next */
    container = !client
      ? document.body.firstElementChild
      : document.body.appendChild(document.createElement('div'))
  })

  beforeEach(function(done){
    container.innerHTML  = ''
    container.innerHTML += '<no-delay>'
    container.innerHTML += '<ye-delay delay="300">'
    el1 = container.children[0]
    el2 = container.children[1]
    time(30, done)
  })

  after(function(){
    document.body.removeChild(container)
  })  
  
  it('should postpone rendering by specified time', function(done) {
    var ripple = delay(components(fn(core())))
    ripple('ye-delay', function(){ this.innerHTML = 'done' })
    
    expect(el2.innerHTML).to.eql('')
    time(200, function(){ expect(el2.innerHTML).to.eql('') })
    time(400, function(){ expect(el2.innerHTML).to.eql('done') })
    time(500, done)
  })

  it('should not affect delay-less components', function(done) {
    var ripple = delay(components(fn(core())))
    ripple('no-delay', function(){ this.innerHTML = 'done' })
    
    time(40 , function(){ expect(el1.innerHTML).to.eql('done') })
    time(100, done)
  })

  it('should work in nested custom elements', function(done) {
    container.innerHTML = '<x-el></x-el>'
    var ripple = delay(components(fn(core())))

    time( 10, function(){
      ripple('x-el', function(){ once(this)('ye-delay[delay="200"]', 1) })
      ripple('ye-delay', function(){ this.innerHTML = 'done' })
    })
    time(100, function(){ expect(container.innerHTML).to.eql('<x-el><ye-delay inert=""></ye-delay></x-el>') })
    time(300, function(){ expect(container.innerHTML).to.eql('<x-el><ye-delay>done</ye-delay></x-el>') })
    time(400, done)
  })

})