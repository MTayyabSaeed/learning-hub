var expect = require('chai').expect
  , core = require('rijs.core').default
  , noop = require('utilise/noop')
  , fn = require('./').default

describe('Function Type', function() {

  it('should create fn resource', function(){  
    var ripple = fn(core())
    ripple('foo', String)
    expect(ripple('foo')).to.eql(String)
  })

  it('should not create fn resource', function(){  
    var ripple = fn(core())
    ripple('baz', [])
    expect(ripple.resources['baz']).to.not.be.ok
  })

  it('should stringify outoging functions', function(){  
    var ripple = fn(core())
    expect(ripple.types['application/javascript'].to({ value: noop })).to.be.eql({ value: 'function noop(){}' })
  })

})