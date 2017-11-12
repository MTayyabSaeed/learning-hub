var sessions = require('./').default
  , expect   = require('chai').expect
  
describe('Sessions', function(){
  it('should skip if no cookie details provided', function(){  
    var ripple = {}
    expect(ripple)
      .to.be.eql(sessions(ripple))
      .to.be.eql(sessions(ripple, {}))
      .to.be.eql(sessions(ripple, { secret: 'secret' }))
      .to.be.eql(sessions(ripple, { name: 'name' }))
  })

  it('should populate sessionID', function(){  
    var ripple = { io: { use: function(fn){ fn(socket, next) }}}
      , next = function(){ nextCalled = true }
      , socket = { request: { headers: { cookie: 'cookie' }}}
      , nextCalled

    expect(sessions(ripple, { secret: 'secret', name: 'name' })).to.eql(ripple)
    expect('sessionID' in socket).to.be.ok
    expect(nextCalled).to.be.ok
  })
})