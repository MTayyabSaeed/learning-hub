var expect = require('chai').expect
  , core = require('rijs.core').default
  , css = require('./').default

describe('CSS Type', function() {

  it('should create css resource', function(){  
    var ripple = css(core())
    ripple('foo', '.class { prop: value }')
    expect(ripple('foo')).to.eql('.class { prop: value }')
  })

  it('should not create css resource', function(){  
    var ripple = css(core())
    ripple('baz', String)
    expect(ripple.resources['baz']).to.not.be.ok
  })

})