var expect = require('chai').expect
  , core = require('rijs.core').default
  , html = require('./').default

describe('HTML Type', function() {

  it('should create html resource', function(){  
    var ripple = html(core())
    ripple('foo', '<div class="foo">')
    expect(ripple('foo')).to.eql('<div class="foo">')
  })

  it('should not create html resource', function(){  
    var ripple = html(core())
    ripple('baz', String)
    expect(ripple.resources['baz']).to.not.be.ok
  })

})