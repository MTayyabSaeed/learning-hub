var expect = require('chai').expect
  , core = require('rijs.core').default
  , data = require('rijs.data').default
  , helpers = require('./').default

describe('Helpers', function(){

  it('should attach helpers, despite updating data', function(){  
    var ripple = helpers(data(core()))

    ripple('foo', { bar: 1 }, { helpers: { help: help } })
    expect(ripple('foo').help).to.be.a('function')
    expect(ripple('foo').help()).to.be.eql(10)
    expect(ripple('foo').bar).to.be.eql(1)

    ripple('foo', { bar: 2 })
    expect(ripple('foo').help).to.be.a('function')
    expect(ripple('foo').bar).to.be.eql(2)    

    function help(){ return 10 }
  })

  it('should not attach anything if not defined', function(){  
    var ripple = helpers(data(core()))

    ripple('foo', { bar: 1 }, { })
    expect(ripple('foo').String).to.not.be.a('function')
    expect(ripple('foo').bar).to.be.eql(1)
  })

  it('should attach helpers via object', function(){  
    var ripple = helpers(data(core()))

    ripple('foo', { bar: 1 }, { helpers: { help: help, num: 5 } })
    expect(ripple('foo').help).to.be.a('function')
    expect(ripple('foo').help()).to.be.eql(10)
    expect(ripple('foo').bar).to.be.eql(1)
    expect(ripple('foo').num).to.be.eql(5)

    ripple('foo', { bar: 2 })
    expect(ripple('foo').help).to.be.a('function')
    expect(ripple('foo').bar).to.be.eql(2)    
    expect(ripple('foo').num).to.be.eql(5)

    function help(){ return 10 }
  })

  it('should serialise and deserialise helper functions', function(){ 
    var ripple = helpers(data(core()))
    ripple('foo', { bar: 1 }, { helpers: { help: help } })
    expect(ripple.types['application/data'].to({})).to.be.eql({})
    expect(ripple.types['application/data'].to(ripple.resources.foo).headers.helpers.help).to.be.a('string')

    expect(ripple.types['application/data'].parse(ripple.resources.foo).headers.helpers.help).to.be.a('function')
    expect(ripple.types['application/data'].parse(ripple.resources.foo).body.help).to.be.a('function')

    function help(){ return 10 }
    help()
  })


})