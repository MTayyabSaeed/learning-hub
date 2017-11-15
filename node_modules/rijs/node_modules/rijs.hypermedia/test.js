var expect = require('chai').expect
  , css = require('rijs.css').default
  , core = require('rijs.core').default
  , data = require('rijs.data').default
  , hypermedia = require('./').default
  , keys = require('utilise/keys')
  , time = require('utilise/time')
  , http = auth()

describe('Hypermedia API', function() {
  this.timeout(15000)

  it('should load root resource', function(done){  
    var ripple = hypermedia(data(core()))
    ripple('github', 'https://api.github.com', { http: http })
    ripple('github').once('change', function(change){
      var github = change.value
      expect(keys(github).length).to.be.gt(10)
      done()
    })
  })

  it('should follow links', function(done){  
    var ripple = hypermedia(data(core()))
    ripple('github', 'https://api.github.com', { http: http })
    ripple('github.current_user_url').on('change', function(change){
      var user = change.value
      if (!user.login) return 
      expect('github' in ripple.resources).to.be.ok
      expect('github.current_user_url' in ripple.resources).to.be.ok
      expect(ripple.resources['github.current_user_url'].headers.timestamp).to.be.ok
      expect(user.login).to.be.equal('OGLES')
      done()
    })
  })

  it('should load and cache intermediate links', function(done){  
    var ripple = hypermedia(data(core()))
    ripple('github', 'https://api.github.com', { http: http })
    ripple('github.current_user_url.id').on('change', function(change){
      var user = change.value
      if (!user.value) return 
      expect('github' in ripple.resources).to.be.ok
      expect('github.current_user_url' in ripple.resources).to.be.ok
      expect('github.current_user_url.id' in ripple.resources).to.be.ok
      expect(user.value).to.be.equal(231825)
      done()
    })
  })

  it('should work with arrays', function(done){  
    var ripple = hypermedia(data(core()))
    ripple('github', 'https://api.github.com', { http: http })
    ripple('github.current_user_url.repos_url.0').on('change', function(change){
      var repo = change.value
      if (!repo.name) return
      expect(repo.name).to.eql('builder')
      done()
    })
  })

  it('should traverse deep simple keys too', function(done){  
    var ripple = hypermedia(data(core()))
    ripple('github', 'https://api.github.com', { http: http })
    ripple('github.current_user_url.repos_url.0.owner.login').on('change', function(change){
      var login = change.value
      if (!login.value) return
      expect(login.value).to.eql('OGLES')
      done()
    })
  })

  it('should use cached resource if available', function(done){  
    var ripple = hypermedia(data(core()))
      , count = 0

    ripple('github', 'https://api.github.com', { http: http })
    
    ripple('github.current_user_url').on('change.first', function(change){ 
      var user = change.value
      if (!user.login) return
      ripple('github.current_user_url').on('change.second', Function('throw Error')) 
      time(1000, done)
    })
  })

  it('should fail if cannot fetch resource - general', function(done){  
    var ripple = hypermedia(data(core()))
    ripple('github', 'https://api.github.com')
    ripple('github.current_user_url').on('change', function(change){
      var body = change.value
      expect(body).to.be.eql({})
    })

    time(2000, function(){
      expect('github' in ripple.resources).to.be.ok
      expect('github.current_user_url' in ripple.resources).to.be.ok
      expect(ripple('github.current_user_url')).to.be.eql({})
      done()
    })
  })

  it('should fail if cannot fetch resource - auth', function(done){  
    var ripple = hypermedia(data(core()))
    ripple('github', 'https://api.api.api.api.com').on('change', Function('throw Error'))

    time(2000, function(){
      expect('github' in ripple.resources).to.be.ok
      expect(ripple('github')).to.be.eql({})
      done()
    })
  })

  it('should alias resource', function(done){  
    var ripple = hypermedia(data(core()))
    ripple('github', 'https://api.github.com', { http: http })
    ripple('repo', { owner: 'pemrouz', repo: 'ripple' }, { link: 'github.repository_url' })
      .on('change', function(change){
        var repo = change.value
        if (!ripple('repo').value) return
        if (!repo.id) return
        expect('repo' in ripple.resources).to.be.ok
        expect('github' in ripple.resources).to.be.ok
        expect('github.repository_url' in ripple.resources).to.be.ok
        expect(ripple('repo').value.id).to.be.equal(21631189)
        expect(ripple.resources['repo'].headers.timestamp).to.be.ok
        done()
      })
  })

  it('should expand parameterised links', function(done){  
    var ripple = hypermedia(data(core()))
    ripple('github', 'https://api.github.com', { http: http })
    ripple('github.repository_url', { owner: 'pemrouz', repo: 'ripple' })
      .on('change', function(change){
        var repo = change.value
        if (!repo.id) return 
        expect('github' in ripple.resources).to.be.ok
        expect('github.repository_url' in ripple.resources).to.be.ok
        expect(ripple.resources['github.repository_url'].headers.timestamp).to.be.ok
        expect(repo.id).to.be.equal(21631189)
        done()
      })

    expect(ripple.resources['github.repository_url'].headers.timestamp).to.not.be.ok
    expect(ripple.resources['github.repository_url'].body.id).to.not.be.ok
  })

  it('should expand optional params in links', function(done){  
    var ripple = hypermedia(data(core()))
    ripple('repo', 'https://api.github.com/repos/pemrouz/ripple', { http: http })
    ripple('repo.issues_url', { number: 1 })
      .on('change', function(change){
        var issue = change.value
        if (!issue.id) return 
        if (!ripple('repo.issues_url')) return
        expect('repo' in ripple.resources).to.be.ok
        expect('repo.issues_url' in ripple.resources).to.be.ok
        expect(ripple('repo.issues_url').id).to.be.equal(39576741)
        expect(ripple.resources['repo.issues_url'].headers.timestamp).to.be.ok
        done()
      })
  })

  it('should expand multiple parameterised links in path', function(done){  
    var ripple = hypermedia(data(core()))
    ripple('github', 'https://api.github.com', { http: http })
    ripple('issue', { owner: 'pemrouz', repo: 'ripple', number: 1 }, { link: 'github.repository_url.issues_url' })
      .on('change', function(change){
        var issue = change.value
        if (!ripple('issue').value) return
        if (!issue.id) return
        expect('issue' in ripple.resources).to.be.ok
        expect('github' in ripple.resources).to.be.ok
        expect('github.repository_url' in ripple.resources).to.be.ok
        expect('github.repository_url.issues_url' in ripple.resources).to.be.ok
        expect(ripple('issue').value.id).to.be.equal(39576741)
        expect(ripple.resources['issue'].headers.timestamp).to.be.ok
        expect(issue.id).to.be.equal(39576741)
        done()
      })

    expect(ripple.resources['issue'].headers.timestamp).to.not.be.ok
    expect(ripple.resources['issue'].body.id).to.not.be.ok
  })

  it('should remove undefined params from url', function(done){  
    var ripple = hypermedia(data(core()))
    ripple('github', 'https://api.github.com', { http: http })
    ripple('issues', { owner: 'pemrouz', repo: 'ripple' }, { link: 'github.repository_url.issues_url' })
      .on('change', function(change){
        var issues = change.value
        if (!ripple('issues').value) return
        if (!issues.length) return
        expect('issues' in ripple.resources).to.be.ok
        expect('github' in ripple.resources).to.be.ok
        expect('github.repository_url' in ripple.resources).to.be.ok
        expect('github.repository_url.issues_url' in ripple.resources).to.be.ok
        expect(ripple('issues').value.length).to.be.above(10)
        expect(ripple.resources['issues'].headers.timestamp).to.be.ok
        expect(issues.length).to.be.above(10)
        done()
      })

    expect(ripple.resources['issues'].headers.timestamp).to.not.be.ok
    expect(ripple.resources['issues'].body.id).to.not.be.ok
  })

  it('should not attempt to register css resources', function(){
    var ripple = hypermedia(data(css(core())))
    ripple('x')
    ripple('x.css')
    expect(ripple.resources['x.css'].headers['content-type']).to.eql('text/css')
  })

})


function auth(){
  return { Authorization: 'Basic ' + new Buffer(process.env.GITHUB_USERNAME + ":" + process.env.GITHUB_PASSWORD).toString('base64') }
}