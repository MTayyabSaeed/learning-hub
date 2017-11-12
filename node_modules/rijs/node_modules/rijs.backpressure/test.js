var core     = require('rijs.core').default
  , data     = require('rijs.data').default
  , sync     = require('rijs.sync').default
  , back     = require('./').default
  , utilise  = require('utilise')
  , expect   = require('chai').expect
  , mockery  = require('mockery')
  , headers  = { 'content-type': 'application/data' }
  , request  = { headers: { 'x-forwarded-for': 10 }}
  , socket   = { emit: function(type, data){ return socket.emitted.push(data)}, request: request}
  , other    = { /*emit: function(type, data){ return other.emitted.push(data)},*/ request: request }
  , sockets, connection, receive, connect, reconnect, connected, disconnected

describe('Backpressure', function(){

  describe('Server', function(){
      
    before(function(){ 
      mockery.enable({ warnOnUnregistered: false })
      mockery.registerMock('socket.io', sioServer)
    })

    after(function(){ 
      mockery.disable()
    })

    beforeEach(function(){
      socket.emitted = []
      other.emitted = []
      sockets = [socket, other]
    })

    it('should initialise correctly', function(){  
      var ripple = back(data(core()))
      expect(ripple.io).to.be.not.ok
      expect(ripple.to).to.be.not.ok
      expect(ripple.from).to.be.not.ok
    
      var ripple = back(sync(data(core())))
      expect(ripple.io).to.be.ok
      expect(ripple.to).to.be.a('function')
      expect(ripple.from).to.be.a('function')
    })

    it('should transform correctly', function(){  
      var ripple 

      ripple = back(next(sync(data(core()))))
      expect(ripple.to({ socket: { deps: { foo: 1 }}, name: 'bar' })).to.be.eql(false)
      expect(ripple.to({ socket: { deps: { foo: 1 }}, name: 'foo' })).to.be.eql(5)

      ripple = back(nonext(sync(data(core()))))
      expect(ripple.to({ socket: { deps: { foo: 1 }}, name: 'bar' })).to.be.eql(false)
      expect(ripple.to({ socket: { deps: { foo: 1 }}, name: 'foo' }))
        .to.be.eql({ socket: { deps: { foo: 1 }}, name: 'foo' })

      function next(ripple) {
        ripple.to = function(){ return 5 }
        return ripple
      }

      function nonext(ripple) {
        ripple.to = null
        return ripple
      }
    })

    it('should not send new resource unless required', function(done){  
      var ripple = back(sync(data(core())))
      expect(socket.deps).to.be.eql({})
      expect(other.deps).to.be.eql({})
      ripple('foo', { foo: 'bar' })

      time(d => {
        expect(other.emitted).to.be.eql([])
        expect(socket.emitted).to.be.eql([])
        done()
      })
    })

    it('should not accept on non-existent resources (server)', function(done){  
      var ripple = back(sync(data(core())))

      receive.call(socket, { name: 'foo', type: 'pull' }) 
      time(d => {
        expect(socket.deps).to.be.eql({})
        expect(other.deps).to.be.eql({})
        expect(ripple.resources.foo).to.be.not.ok
        done()
      })
    })

    it('should ripple(!) changes - efficiently', function(done){  
      var ripple = back(sync(data(core())))

      ripple('foo', { foo: 'bar' }) 

      receive.call(socket, { name: 'foo', type: 'pull' }) 
      expect(socket.deps).to.be.eql({ foo: 1 })
      expect(other.deps).to.be.eql({})
      
      // should not oversend
      ripple('foo', { foo: 'baz' }) 

      // subsequent changes should ripple
      receive.call({ deps: {} }, { name: 'foo', type: 'update', value: { foo: 'boo' }})
      expect(ripple.resources.foo.body).to.be.eql({ foo: 'boo' })

      time(d => {
        expect(socket.emitted).to.be.eql([
          { name: 'foo', time: 0, type: 'update', value: { foo: 'bar' }, headers }
        , { name: 'foo', time: 1, type: 'update', value: { foo: 'baz' }, headers }
        , { name: 'foo', time: 2, type: 'update', value: { foo: 'boo' }, headers }       
        ])
        expect(other.emitted).to.be.eql([])
        done()
      })
    })

    it('should respect existing transforms (outgoing - block)', function(done){  
      var ripple = sync(data(core()))
      ripple.to = falsy
      ripple = back(ripple)

      socket.deps = { foo: 1 }
      ripple('foo', { foo: 'bar' })

      time(d => {
        expect(socket.emitted).to.be.eql([])
        expect(other.emitted).to.be.eql([])
        done()
      })
    })
    
    it('should respect existing transforms (outgoing)', function(done){  
      var ripple = sync(data(core()))
      ripple.to = hash
      ripple = back(ripple)

      socket.deps = { foo: 1 }
      ripple('foo', { foo: 'bar' }) 
      time(d => {
        expect(socket.emitted).to.be.eql([{ name: 'foo', time: 0, type: 'update', value: { hash: 785935555 }, headers }])
        expect(other.emitted).to.be.eql([])
        done()
      })
    })

    it('should respect existing transforms (incoming - block)', function(done){  
      var ripple = sync(data(core()))
      ripple.from = falsy
      ripple = back(ripple)

      ripple('foo', { foo: 'bar' })
      receive.call({ deps: {}}, { name: 'foo', type: 'update', value: { foo: 'baz' }})
      expect(ripple.resources.foo.body).to.be.eql({ foo: 'bar' })
      time(d => {
        expect(socket.emitted).to.be.eql([])
        expect(other.emitted).to.be.eql([])
        done()
      })
    })
    
    it('should respect existing transforms (incoming - pass through)', function(done){  
      var ripple = sync(data(core()))
      ripple.from = hash
      ripple = back(ripple)

      ripple('foo', { foo: 'bar' })
      receive.call({ deps: {}}, { name: 'foo', type: 'update', value: { foo: 'baz' }})
      expect(ripple.resources.foo.body).to.be.eql({ hash: 785943243 })
      time(d => {
        expect(socket.emitted).to.be.eql([])
        expect(other.emitted).to.be.eql([])
        done()
      })
    })
  })

  // Client Test
  describe('Client', function(){

    after(function(){ 
      mockery.disable()
    })

    before(function(){
      this.timeout(5000)
      mockery.enable({ warnOnUnregistered: false })
      mockery.registerMock('socket.io-client', sioClient)
      keys(require.cache).map(d => delete require.cache[d])
      require('browserenv')
      keys(require.cache).map(d => delete require.cache[d])
      require('utilise')
      global.Element = window.Element
      global.Node = window.Node
      global.requestAnimationFrame = function(fn){ time(1, fn) }
      back = require('./').default
      sync = require('rijs.sync').default
      draw = require('rijs.components').default
      fn   = require('rijs.fn').default
    })

    beforeEach(function(){
      emitted = []
      connected = disconnected = null
      document.body.innerHTML = ''
    })
 
    it('should initialise correctly', function(){  
      var ripple = back(sync(draw(data(core()))))
      expect(ripple.requested).to.be.eql({})
      expect(ripple.pull).to.be.a('function')
      expect(ripple.deps).to.be.a('function')
    })

    it('should extract deps', function(){  
      var ripple = back(sync(draw(data(core()))))
        , el1 = el('x-foo[data=A A b][css=x-foo.css][is=baz]')
      
      expect(ripple.deps(el1)).to.eql(['x-foo', 'a', 'b', 'x-foo.css', 'baz'])
    })

    it('should pull resource not previously requested', function(done){
      document.body.innerHTML = '<x-foo><x-bar></x-bar></x-foo>'
      var ripple = back(sync(draw(data(core()))))
        , foo = document.body.firstChild
        , bar = foo.firstChild

      // pull everything
      time(20, function(){
        expect(emitted).to.eql([
          ['change', { name: 'x-foo', type: 'pull' }]
        , ['change', { name: 'x-bar', type: 'pull' }]
        ])

        emitted = []
        delete ripple.requested['x-bar']
        foo.draw()
      })

      // pull children
      time(60, function(){
        expect(emitted).to.eql([
          ['change', { name: 'x-bar', type: 'pull' }]
        ])

        done()
      })
    })

    it('should not pull on bailed draw', function(done){  
      document.body.innerHTML = '<x-foo><x-bar></x-bar></x-foo>'
      var ripple = back(sync(bail(draw(fn(data(core()))))))
        , foo = document.body.firstChild
        , bar = foo.firstChild

      ripple('x-foo', noop)
      
      time(30, function(){
        delete ripple.requested['x-bar']
        emitted = []
        ripple.draw(foo)
      })

      time(100, function(){
        expect(emitted).to.eql([])
        done()
      })

      function bail(ripple) {
        ripple.render = function(el){ return false }
        return ripple
      }
    })

    it('should refresh cache on connect', function(){  
      var ripple = back(sync(load(draw(fn(data(core()))))))
      
      expect(ripple.requested).to.eql({})
      connect()
      expect(ripple.requested.foo instanceof Promise).to.be.ok
      expect(ripple.requested.bar instanceof Promise).to.be.ok

      time(d => expect(emitted).to.eql([
        ['change', { name: 'foo', type: 'pull' }]
      , ['change', { name: 'bar', type: 'pull' }]
      ]))

      function load(ripple) {
        ripple('foo', [])
        ripple('bar', [])
        return ripple
      }
    })

    it('should force refresh on reconnect', function(){  
      var ripple = back(sync(draw(fn(data(core())))))
  
      reconnect()
      expect(connected).to.be.ok
      expect(disconnected).to.be.ok
    })

    it('should not make multiple requests for same resource', function(done){  
      document.body.innerHTML = '<x-foo></x-foo><x-foo></x-foo><x-foo></x-foo>'
      var ripple = back(sync(draw(fn(data(core())))))
      
      document.body.children[0].draw()
      document.body.children[1].draw()
      document.body.children[2].draw()

      time(50, function(){
        expect(emitted).to.have.lengthOf(1)
        expect(ripple.requested['x-foo'] instanceof Promise).to.be.ok
        done()
      })
    })

    it('should subscribe node to updates', function(){  
      document.body.innerHTML = '<x-foo></x-foo>'
      var ripple = back(sync(draw(data(core()))))
        , foo = document.body.firstChild

      ripple.pull('bar', foo)
      expect(attr('data')(foo)).to.be.eql('bar')

      ripple.pull('bar', foo)
      expect(attr('data')(foo)).to.be.eql('bar')

      ripple.pull('baz', foo)
      expect(attr('data')(foo)).to.be.eql('bar baz')
    })

  })

})

function sioServer(o){
  return {
    use: function(fn){
      sockets.map(function(s){ fn(s, noop) })
    }
  , on: function(type, fn){
      if (type === 'change') receive = fn
      if (type === 'connection' && includes('change')(str(fn))) fn({ on: noop })
      if (type === 'connection') connection = fn
  }
  , of: function(){ return { sockets: sockets } }
  }
}

function sioClient(){
  return { 
    on: function(type, fn){
      if (type === 'connect') connect = fn
      if (type === 'reconnect') reconnect = fn
    }
  , emit: function(type, data) { emitted.push([type, data]) }
  , io: { connect: function(){ connected = true }, disconnect: function(){ disconnected = true } }
  }
} 

function hash(req) {
  req.value = { hash: hashcode(str(req.value)) }
  return req
}