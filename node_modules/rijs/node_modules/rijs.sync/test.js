require('utilise')
require('feign')('socket.io', sio)
require('feign')('express', express)
var core     = require('rijs.core').default
  , data     = require('rijs.data').default
  , sync     = require('./').default
  , expect   = require('chai').expect
  , express  = require('express')
  , request  = { headers: { 'x-forwarded-for': '?' } }
  , { createServer, Server } = require('http')

describe('Sync', function(){

  it('should initialise correctly', function(){  
    // initialise without server
    const ripple1 = sync(emitterify({}))
    expect(ripple1).to.be.a('object')
    expect(ripple1.server instanceof Server).to.be.ok
    expect(ripple1.server).to.be.a('object')
    expect(ripple1.send).to.be.a('function')
    expect(ripple1.req).to.be.a('function')
    expect(ripple1.to).to.be.a('function')
    expect(ripple1.io).to.be.a('object')

    // initialise with express server
    const ripple2 = sync(data(core()), { server: createServer(express()) })
    expect(ripple2).to.be.a('function')
    expect(ripple2.server instanceof Server).to.be.ok
    expect(ripple2.server.express.name).to.be.equal('app')
    expect(ripple2.send).to.be.a('function')
    expect(ripple2.req).to.be.a('function')
    expect(ripple2.to).to.be.a('function')
    expect(ripple2.io).to.be.a('object')

    // initialise with plain server
    const ripple3 = sync(data(core()), { server: createServer() })
    expect(ripple3).to.be.a('function')
    expect(ripple3.server instanceof Server).to.be.ok
    expect(ripple3.server.express.name).to.be.equal('app')
    expect(ripple3.send).to.be.a('function')
    expect(ripple3.req).to.be.a('function')
    expect(ripple3.to).to.be.a('function')
    expect(ripple3.io).to.be.a('object')
  })

  it('should send change', function(done){  
    sendto(done, null, null, null, [
      { name: 'foo', time: 0, type: 'update', value: { bar: 'baz' }, headers: { 'content-type': 'application/data' } }
    , { name: 'foo', time: 1, type: 'update', value: { baz: 'four' }, headers: { 'content-type': 'application/data' } }
    , { name: 'foo', time: 2, type: 'update', key: 'bar.foo', value: 'seven' }
    ])
  })

  it('should send change - resource', function(done){  
    sendto(done, hash, null, null, [
      { name: 'foo', time: 0, type: 'update', value: { hash: 1007607064 }, headers: { 'content-type': 'application/data' } }
    , { name: 'foo', time: 1, type: 'update', value: { hash: -273689001 }, headers: { 'content-type': 'application/data' } }
    , { name: 'foo', time: 2, type: 'update', key: 'bar.foo', value: { hash: 109330445  } }
    ])
  })

  it('should send change - type', function(done){  
    sendto(done, null, hash, null, [
      { name: 'foo', time: 0, type: 'update', value: { hash: 1007607064 }, headers: { 'content-type': 'application/data' } }
    , { name: 'foo', time: 1, type: 'update', value: { hash: -273689001 }, headers: { 'content-type': 'application/data' } }
    , { name: 'foo', time: 2, type: 'update', key: 'bar.foo', value: { hash: 109330445  } }
    ])
  })

  it('should send change - global', function(done){  
    sendto(done, null, null, hash, [
      { name: 'foo', time: 0, type: 'update', value: { hash: 1007607064 }, headers: { 'content-type': 'application/data' } }
    , { name: 'foo', time: 1, type: 'update', value: { hash: -273689001 }, headers: { 'content-type': 'application/data' } }
    , { name: 'foo', time: 2, type: 'update', key: 'bar.foo', value: { hash: 109330445  } }
    ])
  })

  it('should send change - block - resource', function(done){  
    sendto(done, falsy, null, null, [
      false
    , false
    , false
    ])
  })

  it('should send change - block - type', function(done){  
    sendto(done, null, falsy, null, [
      false
    , false
    , false
    ])
  })

  it('should send change - block - global', function(done){  
    sendto(done, null, null, falsy, [
      false
    , false
    , false
    ])
  })

  it('should await promise', function(done){  
    sendto(done, delay, delay, delay, [
      { name: 'foo', time: 0, type: 'update', value: '{"bar":"baz"}!!!', headers: { 'content-type': 'application/data' } }
    , { name: 'foo', time: 1, type: 'update', value: '{"baz":"four"}!!!', headers: { 'content-type': 'application/data' } }
    , { name: 'foo', time: 2, type: 'update', key: 'bar.foo', value: 'seven!!!' }
    ])
  })

  it('should broacast all resources on connection', function(done){  
    const ripple = sync(data(core()))
        , time = 0
        , type = 'update'
        , socket = createSocket()
        , expected = [
            { name: 'foo', type, time, headers: {'content-type': 'application/data'}, value: { foo: 'bar' }}
          , { name: 'bar', type, time, headers: {'content-type': 'application/data'}, value: { bar: 'foo' }}
          , { name: 'baz', type, time, headers: {'content-type': 'application/data'}, value: { baz: 'boo' }}
          ]

    ripple('foo', { foo: 'bar' }) 
    ripple('bar', { bar: 'foo' }) 
    ripple('baz', { baz: 'boo' }) 
    ripple.io.connect(socket)
    emitted(socket, expected)
      .then(done)
      .catch(console.error)
  })

  it('should broacast to specific sockets - sid fail', function(done){
    const ripple = sync(data(core()))
        , { send } = ripple
        , type = 'update'
        , socket = createSocket()

    ripple('foo', { foo: 'bar' })
    ripple.io.connect(socket)

    time(10, d => {
      send('sid')()
      emitted(socket, [])
        .then(done)
        .catch(console.error)
    })
  })

  it('should broacast to specific sockets - sid pass', function(done){
    const ripple = sync(data(core()))
        , { send } = ripple
        , type = 'update'
        , socket = createSocket()

    ripple('foo', { foo: 'bar' })
    ripple.io.connect(socket)
    
    time(10, d => {
      emitted(socket, [{ name: 'foo', value: { foo: 'bar' }, time: 0, type, headers: {'content-type': 'application/data' }}])
        .then(done)
        .catch(console.error)
      socket.sessionID = 'sid'
      send('sid')()
    })
  })

  it('should broacast to specific sockets - socket', function(done){
    const ripple = sync(data(core()))
        , { send } = ripple
        , type = 'update'
        , socket = createSocket()

    ripple('foo', { foo: 'bar' })
    ripple.io.connect(socket)
  
    time(10, d => {
      send(socket)()
      emitted(socket, [{ name: 'foo', value: { foo: 'bar' }, time: 0, type, headers: {'content-type': 'application/data' }}])
        .then(done)
        .catch(console.error)
    })
  })

  it('should consume change', function(done){
    from(done, null, null, null, [
      { bar: 'baz' }
    , { baz: 'four' }
    , { baz: 'four', bar: { foo: 'seven' } }
    ])
  })

  it('should consume change - block - resource', function(done){  
    from(done, falsy, null, null, [{}, {}, {}])
  })

  it('should consume change - block - type', function(done){  
    from(done, null, falsy, null, [{}, {}, {}])
  })

  it('should consume change - block - global', function(done){  
    from(done, null, null, falsy, [{}, {}, {}])
  })
 
  it('should consume change - resource', function(done){  
    from(done, hash, null, null, [
      { hash: 1007607064 }
    , { hash: -273689001 }
    , { hash: -273689001, bar: { foo: { hash: 109330445 } } }
    ])
  })

  it('should consume change - type', function(done){  
    from(done, null, hash, null, [
      { hash: 1007607064 }
    , { hash: -273689001 }
    , { hash: -273689001, bar: { foo: { hash: 109330445 } } }
    ])
  })

  it('should consume change - global', function(done){  
    from(done, null, null, hash, [
      { hash: 1007607064 }
    , { hash: -273689001 }
    , { hash: -273689001, bar: { foo: { hash: 109330445 } } }
    ])
  })

  it('should ripple(!) changes', function(done){
    const ripple = sync(data(core()))
        , socket1 = createSocket()
        , socket2 = createSocket()

    ripple.io.connect(socket1)
    ripple.io.connect(socket2)

    socket1.receive({ name: 'foo', time: 0, type: 'update', value: { bar: 'baz' }})
    expect(ripple.resources.foo.body).to.eql({ bar: 'baz' })
    emitted(socket1, [])
    emitted(socket2, [{ name: 'foo', time: 0, type: 'update', value: { bar: 'baz' }, headers: { 'content-type': 'application/data'}}])

    time(10, done)
  })

  it('should never send silent headers', function(done){  
    const ripple = sync(data(core()))
        , socket = createSocket()
    ripple.io.connect(socket)

    socket.receive.call({ socket: 42 }, { name: 'foo', type: 'update', value: { bar: 'baz' }})
    expect(ripple.resources.foo.headers.silent).to.be.eql({ socket: 42 })
    emitted(socket, [{ name: 'foo', time: 0, type: 'update', value: { bar: 'baz' }, headers: { 'content-type': 'application/data'}}])
      .then(done)
      .catch(console.error)
  })
  
  it('should send/recv names with .', function(done){  
    sendrecv(
      done
    , ['foo.bar']
    , [[200, 'ok (foo.bar, update)']]
    , null
    , { name: 'foo.bar', body: 'baz' }
    )
  })

  it('should respond with custom response', function(done){  
    sendrecv(
      done
    , [{ name: 'foo' }]
    , [[999, 'ack']]
    , (req, res) => res(999, 'ack')
    )
  })

  it('should respond with custom response (shorthand)', function(done){  
    sendrecv(
      done
    , ['foo']
    , [[999, 'ack']]
    , (req, res) => res(999, 'ack')
    )
  })
 
  it('should respond with 200 on standard mutation', function(done){
    sendrecv(
      done
    , [{ name: 'foo', type: 'add', value: 'bar' }]
    , [[200, 'ok (foo, add)']]
    )
  })

  it('should respond with 200 on standard mutation (shorthand)', function(done){
    sendrecv(
      done
    , ['foo', 'add', 'bar']
    , [[200, 'ok (foo, add)']]
    )
  })

  it('should respond with 200 on standard mutation (new)', function(done){
    sendrecv(
      done
    , [{ name: 'foo', type: 'update', value: { bar: 'baz' } }]
    , [[200, 'ok (foo, update)']]
    )
  })

  it('should respond with 200 on standard mutation (new) (shorthand)', function(done){
    sendrecv(
      done
    , ['foo', 'update', { bar: 'baz' }]
    , [[200, 'ok (foo, update)']]
    )
  })

  it('should send all if no name', function(done){  
    sendrecv(
      done
    , [{}]
    , [[[200, 'ok (foo, update)']]]
    )
  })

  it('should send all if no name (shorthand)', function(done){  
    sendrecv(
      done
    , ['']
    , [[[200, 'ok (foo, update)']]]
    )
  })

  // it('should not send if invalid name', function(done){  
  //   sendrecv(
  //     done
  //   , [{ name: 'invalid' }]
  //   , [404, 'cannot find invalid']
  //   )
  // })

  // it('should not send if invalid name (shorthand)', function(done){  
  //   sendrecv(
  //     done
  //   , ['invalid']
  //   , [404, 'cannot find invalid']
  //   )
  // })

  it('should respond with 405 if type/verb not handled', function(done){  
    sendrecv(
      done
    , [{ name: 'foo', type: 'dance' }]
    , [[405, 'method not allowed']]
    )
  })

  it('should respond with 405 if type/verb not handled (shorthand)', function(done){  
    sendrecv(
      done
    , ['foo', 'dance']
    , [[405, 'method not allowed']]
    )
  })

  it('should catch errors (default to 500)', function(done){  
    sendrecv(
      done
    , ['foo']
    , [[500, 'WTF!']]
    , fail
    )

    function fail(req, res) {
      throw new Error('WTF!')
    }
  })

  it('should catch errors (default to 500)', function(done){  
    sendrecv(
      done
    , ['foo']
    , [[313, 'WTF!!']]
    , fail
    )

    function fail(req, res) {
      e = new Error('WTF!!')
      e.status = 313
      throw e
     }
  })

  it('should allow emitting custom event and return promise - single socket', function(done){
    const ripple = sync(data(core()))
        , { send } = ripple
        , socket = createSocket()

    ripple('foo', [])
    send(socket)({ name: 'foo', type: 'update', value: ['bar'] }).then(replies => {
      expect(replies).to.be.eql([['reply 1']])
      emitted(socket, [{ name: 'foo', type: 'update', value: ['bar'], headers: { 'content-type': 'application/data'}}])
      done()
    }).catch(console.error)

    time(d => socket.ack('reply 1'))
  })

  it('should allow emitting custom event and return promise - multiple socket', function(done){
    const ripple = sync(data(core()))
        , { send } = ripple
        , socket1 = createSocket()
        , socket2 = createSocket()

    ripple('foo', [])
    send([socket1, socket2])({ name: 'foo', type: 'update', value: ['bar'] }).then(replies => {
      expect(replies).to.be.eql([['reply 2'], ['reply 3']])
      emitted(socket1, [{ name: 'foo', type: 'update', value: ['bar'], headers: { 'content-type': 'application/data'} }])
      emitted(socket2, [{ name: 'foo', type: 'update', value: ['bar'], headers: { 'content-type': 'application/data'} }])
      done()
    }).catch(console.error)

    time(d => {
      socket1.ack('reply 2')
      socket2.ack('reply 3')
    })
  })
  
  it('should set ip', function(){  
    const ripple = sync(data(core()))
        , socket1 = createSocket({ headers: { 'x-forwarded-for': 10 }})
        , socket2 = createSocket({ headers: {}, connection: { 'remoteAddress': 20 }})

    ripple.io.connect(socket1)
    ripple.io.connect(socket2)
    expect(socket1.ip).to.be.eql(10)
    expect(socket2.ip).to.be.eql(20)
  })

  it('should be immutable req across sockets', function(done){
    const ripple = sync(data(core()))
        , { send } = ripple
        , socket1 = createSocket()
        , socket2 = createSocket()

    ripple.io.connect(socket1)
    ripple.io.connect(socket2)
    ripple('foo', { foo: 5 }, { to })
    emitted(socket1, [])
    emitted(socket2, [])
    time(10, done)

    function to(req) {
      expect(req.value).to.eql({ foo: 5 })
      return false
    }
  })

  it('should allow sending req to self', function(done){
    const ripple = sync(data(core()))
        , increment = ({ name }) => ({ name, type: 'update', value: { counter: ripple('store').counter + 1 }})
        , decrement = ({ name }) => ({ name, type: 'update', value: { counter: ripple('store').counter - 1 }})
        , socket = createSocket()

    ripple.io.connect(socket)

    ripple('store', { counter: 5 }, { from, to })
    expect(ripple('store')).to.eql({ counter: 5 })

    ripple.req('store', 'INCREMENT')
    ripple.req({ name: 'store', type: 'INCREMENT' })
    emitted(socket, [
      { name: 'store', value: { counter: 5 }, time: 0, type: 'update', headers: {'content-type': 'application/data' }}
    , { name: 'store', value: { counter: 6 }, time: 1, type: 'update', headers: {'content-type': 'application/data' }}
    , { name: 'store', value: { counter: 7 }, time: 2, type: 'update', headers: {'content-type': 'application/data' }}
    ]).catch(console.error)

    time(20, d => {
      expect(ripple('store')).to.eql({ counter: 7 })
      ripple.req('store', 'DECREMENT')
      ripple.req({ name: 'store', type: 'DECREMENT' })
      emitted(socket, [
        { name: 'store', value: { counter: 6 }, time: 3, type: 'update', headers: {'content-type': 'application/data' }}
      , { name: 'store', value: { counter: 5 }, time: 4, type: 'update', headers: {'content-type': 'application/data' }}
      ]).catch(console.error)

      time(20, d => {
        expect(ripple('store')).to.eql({ counter: 5 })
        done()
      })
    })
    
    function to(req) {
      req.value = clone(req.value)
      return req
    }
    function from(req, res) {
      return req.type == 'INCREMENT' ? increment(req, res)
           : req.type == 'DECREMENT' ? decrement(req, res)
                                     : false
    }
  })

  it('should allow sending req to self and respond', function(done){
    const ripple = sync(data(core()))
        , { req } = ripple
        , replied = []

    ripple('store', { counter: 5 }, { from })
    
    req('store', 'VALID')
      .then(replies => replied.push(replies))
    
    time(10, d => 
      req('store', 'INVALID')
        .then(replies => replied.push(replies)))
    
    time(30, d => {
      expect(replied).to.be.eql([
        [[201, 'ok']]
      , [[501, 'not ok']]
      ])
      done()
    })

    function from(req, res) {
      return req.type == 'VALID' 
           ? res(201, 'ok')
           : res(501, 'not ok')
    }
  })

  it('should not send circular structure', function(done){
    const ripple = sync(data(core()))
        , a = {}
        , socket = createSocket()
    
    a.b = a
    ripple.io.connect(socket)
    ripple('circular', a)
    emitted(socket, [])
      .then(done)
      .catch(console.error)
  })

})

function express() {
  app.listen = d => createServer()
  return app
  function app() {}
}

function sio(o){
  let sockets = []
    , use = []
    , connect

  return {
    use: fn => use.push(fn)
  , connect: s => {
      s.on = (type, fn) => type == 'change' && (s.receive = fn)
      sockets.push(s)
      use.map(fn => fn(s, noop))
      connect(s)
      return s
    }
  , on: function(type, fn){
      if (type === 'connection') connect = fn 
  }
  , of: d => ({ sockets: sockets })
  }
}

function emitted(socket, records) {
  const p = promise()
  socket.emitted = actual => {
    const expected = records.shift()
    if (!expected) return expect(actual).to.be.not.ok
    if (expected.headers) {
      expect(actual.headers['content-type']).to.eql(expected.headers['content-type'])
      expect(actual.headers.silent).to.eql(expected.headers.silent)
    } else {
      expect(actual.headers).to.be.not.ok
    }

    keys(actual)
      .filter(not(is('socket')))
      .filter(not(is('headers')))
      .map(k => expect(actual[k]).to.be.eql(expected[k]))

    keys(expected)
      .filter(not(is('headers')))
      .map(k => expect(actual[k]).to.be.eql(expected[k]))

    if (!records.length)
      p.resolve()
  }

  if (!records.filter(Boolean).length) time(10, d => p.resolve())
  return p
}

function sendto(done, res, typ, all, expected) {
  const ripple = sync(data(core()))
      , headers = {}
      , socket = createSocket()

  ripple.io.connect(socket)
  if (res) headers.to = transform(headers.to)(res)
  if (typ) ripple.types['application/data'].to = transform(ripple.types['application/data'].to)(typ)
  if (all) ripple.to = transform(ripple.to)(all)

  // new
  ripple('foo', { bar: 'baz' }, headers) 

  // replace
  ripple('foo', { baz: 'four' })

  // deep diff
  update('bar.foo', 'seven')(ripple('foo'))

  emitted(socket, expected)
    .then(done)
    .catch(console.error)
}

const transform = next => fn => req => {
  expect('name'   in req).to.be.ok
  expect('type'   in req).to.be.ok
  expect('time'   in req).to.be.ok
  expect('value'  in req).to.be.ok
  expect('socket' in req).to.be.ok
  return fn((next || identity)(req))
}

function from(done, res, typ, all, expected) {
  const ripple = sync(data(core()))
      , headers = {}
      , socket = createSocket()

  ripple.io.connect(socket)
  if (res) headers.from = transform(res)
  if (typ) ripple.types['application/data'].from = transform(typ)
  if (all) ripple.from = transform(all)

  ripple('foo', {}, headers) 
  
  time(10, d => {
    // new
    socket.receive({ name: 'foo', time: 0, type: 'update', value: { bar: 'baz' }}, ack)
    expect(ripple.resources.foo.name).to.eql('foo')
    expect(ripple.resources.foo.body).to.eql(expected[0]) 
    expect(ripple.resources.foo.headers['content-type']).to.eql('application/data')

    // replace
    socket.receive({ name: 'foo', time: 1, type: 'update', value: { baz: 'four' }}, ack)
    expect(ripple.resources.foo.name).to.eql('foo') 
    expect(ripple.resources.foo.body).to.eql(expected[1]) 
    expect(ripple.resources.foo.headers['content-type']).to.eql('application/data')

    // deep diff
    socket.receive({ name: 'foo', time: 2, type: 'update', value: 'seven', key: 'bar.foo' }, ack)
    expect(ripple.resources.foo.name).to.eql('foo') 
    expect(ripple.resources.foo.body).to.eql(expected[2]) 
    expect(ripple.resources.foo.headers['content-type']).to.eql('application/data')
    
    emitted(socket, [])
      .then(done)
      .catch(console.error)
  })

  function transform(fn) {
    return function(req, res) {
      expect('name'   in req).to.be.ok
      expect('type'   in req).to.be.ok
      expect('time'   in req).to.be.ok
      expect('value'  in req).to.be.ok
      expect('socket' in req).to.be.ok
      expect(res).to.be.a('function')
      expect(arguments.length).to.be.eql(2)
      return fn(req)
    }
  }

  function ack(status, message) {
    expect(status).to.be.eql(200)
    expect(message).to.be.eql('ok (foo, update)')
  }
}

function delay(req) {
  const p = promise()
  time(10, d => { 
    req.value = str(req.value) + '!'
    p.resolve(req)
  })
  return p
}

function hash(req) {
  req.value = { hash: hashcode(str(req.value)) }
  return req
}

function sendrecv(done, args, expected, from, resources) {
  const server = sync(data(core()))
      , client = sync(data(core()))
      , socket1 = createSocket() 
      , socket2 = createSocket() 

  socket1.emit = (type, req, res) => socket2.receive(clone(req), res)
  socket2.emit = (type, req, res) => socket1.receive(clone(req), res)

  server.io.connect(socket1)
  client.io.connect(socket2)

  server('foo', [], (from ? { from } : {}))
  server(resources)

  time(10, d => {
    expect(server.resources.foo).to.be.ok
    expect(client.resources.foo).to.be.ok
    client.send().apply({}, args)
      .then(response)
      .catch(console.error)
  })

  function response(reply) {
    expect(reply).to.be.eql(expected)
    done()
  }

}

function createSocket(request = { headers: { 'x-forwarded-for': '?' } }, socket) {
  return socket = {
    on: noop
  , request
  , emit: (type, req, res) => {
      expect(type).to.equal('change')
      expect(res).to.be.a('function')
      socket.ack = res
      if (socket.emitted) socket.emitted(req)
    }
  }
}