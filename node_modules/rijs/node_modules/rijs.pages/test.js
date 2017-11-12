var expect  = require('chai').expect
  , request = require('supertest')
  , app     = require('express')()
  , server  = require('http').createServer(app)
  , pages   = require('./').default({}, { server, dir: __dirname + '/src' })

describe('Serve Pages', function() {
  
  it('should pass over serverless node', function(){  
    expect(require('./').default({})).to.be.eql({})
  })

  it('should gracefully proceed if no server/dir', function(){  
    expect(require('./').default({}, {})).to.be.eql({})
  })

  it('should serve pages - hit', function(done){  
    request(app)
      .get('/index.html')
      .expect('<h1>Hello World</h1>')
      .expect(200, done)
  })

  it('should serve pages - miss', function(done){  
    request(app)
      .get('/404.html')
      .expect('Cannot GET /404.html\n')
      .expect(404, done)
  })

})