var expect = require('chai').expect
  , core = require('rijs.core').default
  , data = require('rijs.data').default
  , react = require('./').default

describe('Reactive Data', function() {

  it('should react to changes in data', function(done){  
    var ripple = react(data(core()))
    ripple('foo', [])
    ripple('foo').once('change', function(foo){
      expect(!!ripple.resources.foo.body.observer).to.be.eql(!!Object.observe)
      expect(!!ripple.observer).to.be.eql(!Object.observe)
      expect(foo).to.eql(['bar'])
      done()
    })
    ripple('foo').push('bar')
  })

  it('should add change details - push', function(done){  
    if (!Object.observe) return done()
    var ripple = react(data(core()))
    ripple('foo', [])
    ripple('foo').push('bar')
    ripple('foo').once('change', function(foo, change){
      expect(change).to.eql({ key: '0', value: 'bar', type: 'push' })
      done()
    })
  })

  it('should add change details - update', function(done){  
    if (!Object.observe) return done()
    var ripple = react(data(core()))
    ripple('foo', ['foo'])
    ripple('foo')[0] = 'bar'
    ripple('foo').once('change', function(foo, change){
      expect(change).to.eql({ key: '0', value: 'bar', type: 'update' })
      done()
    })
  })

  it('should add change details - remove', function(done){  
    if (!Object.observe) return done()
    var ripple = react(data(core()))
    ripple('foo', ['foo'])
    ripple('foo').pop()
    ripple('foo').once('change', function(foo, change){
      expect(change).to.eql({ key: '0', value: 'foo', type: 'remove' })
      done()
    })
  })

  it('should add change details - load', function(done){  
    var ripple = react(data(core()))
    ripple.once('change', function(res, change){
      expect(change).to.eql({ type: 'load' })

      ripple('foo').once('change', function(foo, change){
        expect(change.type).to.be.not.ok

        ripple('foo').once('change', function(foo, change){
          expect(change).to.be.not.ok
          done()
        })
        ripple('foo').emit('change')
      })
      ripple('foo', ['foo'])
    })
    ripple('foo', ['foo'])
  })

  it('should not duplicate observers', function(done){  
    var ripple = react(data(core()))
      , count = 0

    ripple('foo', ['foo']) 
    ripple('foo').on('change', function(){ count++ })
    ripple('foo').emit('change')
    ripple('foo').emit('change')
    ripple('foo').push('bar')

    setTimeout(function(){
      expect(count).to.eql(3)
    }, 150)
    setTimeout(done, 200)
  })

  it('should have at least two level observation', function(done){  
    var ripple = react(data(core()))
    ripple('foo', [{foo:'bar'}])
    ripple('foo').once('change', function(data){
      expect(data).to.eql([{foo:'foo'}])
      done()
    })

    ripple('foo')[0].foo = 'foo'
  })

  it('should allow opting out of reaction per resource', function(done){  
    var ripple = react(data(core()))
      , count = 0

    ripple('foo', { foo:'bar' }, { reactive: false })
    ripple('foo').once('change', function(){ count++ })
    ripple('foo').foo = 'foo'
    setTimeout(function(){
      expect(ripple.resources.foo.headers.reactive).to.be.false
      expect(ripple.resources.foo.body.observer).to.not.exist
      expect(count).to.be.eql(0)
      done()
    }, 150)
  })

  it('should not duplicate manual emits', function(done){  
    var ripple = react(data(core()))
      , count = 0

    ripple('foo').on('change', function(){ count++ })
    ripple('foo', ['foo']) 
    ripple('foo', ['foo']) 
    
    setTimeout(function(){
      expect(count).to.eql(2)
    }, 150)
    setTimeout(done, 200)
  })

})