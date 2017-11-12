var expect = require('chai').expect
  , client = require('utilise/client')
  , time = require('utilise/time')
  , path = require('path')
  , core = require('rijs.core').default
  , css = require('rijs.css').default
  , fn = require('rijs.fn').default
  , resdir = require('./').default
  , fs = require('fs')
 
describe('Resources Folder', function(){

  it('should auto load resources folder', function(done){  
    var ripple = resdir(fn(css(core())))
    ripple.on('ready', d => {
      expect(ripple('foo')).to.be.a('function')
      expect(ripple('foo').name).to.eql('foo')
      expect(ripple('bar.css')).to.equal('.bar {}')
      expect(ripple('sth')).to.be.a('function')
      expect(ripple('data')).to.be.eql(String)
      expect(ripple.resources.test).to.not.be.ok
      done()
    })
  })

  it('should auto load from specific dir', function(done){  
    var ripple = resdir(fn(css(core())), path.resolve())
    ripple.on('ready', d => {
      expect(ripple('foo')).to.be.a('function')
      expect(ripple('foo').name).to.eql('foo')
      expect(ripple('bar.css')).to.equal('.bar {}')
      expect(ripple('sth')).to.be.a('function')
      expect(ripple('data')).to.be.eql(String)
      expect(ripple.resources.test).to.not.be.ok
      done()
    })
  })

  it('should auto load from specific dir with opts', function(done){  
    var ripple = resdir(fn(css(core())), { dir: path.resolve() })
    ripple.on('ready', d => {
      expect(ripple('foo')).to.be.a('function')
      expect(ripple('foo').name).to.eql('foo')
      expect(ripple('bar.css')).to.equal('.bar {}')
      expect(ripple('sth')).to.be.a('function')
      expect(ripple('data')).to.be.eql(String)
      expect(ripple.resources.test).to.not.be.ok
      done()
    })
  })

  it('should auto load resources folder when no dir prop on opts', function(done){  
    var ripple = resdir(fn(css(core())), { })
    ripple.on('ready', d => {
      expect(ripple('foo')).to.be.a('function')
      expect(ripple('foo').name).to.eql('foo')
      expect(ripple('bar.css')).to.equal('.bar {}')
      expect(ripple('sth')).to.be.a('function')
      expect(ripple('data')).to.be.eql(String)
      expect(ripple.resources.test).to.not.be.ok
      done()
    })
  })

  it('should watch for changes', function(done){  
    var ripple = resdir(fn(css(core())), path.resolve())

    ripple.on('ready', d => {
      expect(ripple('foo').name).to.be.eql('foo')
      fs.writeFileSync('./resources/foo.js', 'module.exports = function baz(){ }')

      ripple.once('change', function(){
        expect(ripple('foo').name).to.be.eql('baz')
        fs.writeFileSync('./resources/foo.js', 'module.exports = function foo(){ }')
        done()
      })
    })
  })

  it('should not auto-add needs header for default styles', function(done){  
    var ripple = resdir(fn(css(core())))
    ripple.on('ready', d => {
      expect(ripple('component')).to.be.a('function')
      expect(ripple('component.css')).to.be.eql(':host {}')
      expect(ripple.resources.component.headers.needs).to.be.eql('[css]')
      expect(ripple.resources.foo.headers.needs).to.be.not.ok
      done()
    })
  })

  it('should ignore resources prefixed with _', function(done){  
    var ripple = resdir(fn(css(core())))
    ripple.on('ready', d => {
      expect(ripple.resources.ignore).to.not.be.ok
      done()
    })
  })

  it('should invoke loaded function', function(done){  
    var ripple = resdir(fn(css(core())))
    ripple.on('ready', d => {
      expect(loadedResdir[0]).to.eql(ripple)
      expect(loadedResdir[1].name).to.eql('data')
      expect(loadedResdir[1].body).to.eql(String)
      delete global.loadedResdir

      fs.appendFileSync('./resources/data.js', ' ')
      ripple.once('change', function(){
        expect(loadedResdir[1].name).to.eql('data')
        expect(loadedResdir[1].body).to.eql(String)
        done()
      })
    })
  })

  it('should load from additional resdirs from command line', function(done){  
    process.argv = [
      0
    , 0
    , '--resdirs'
    , './tertiary,./secondary'
    ]

    var ripple = resdir(fn(core()))
    ripple.on('ready', d => {
      expect('data' in ripple.resources).to.be.ok
      expect('secondary' in ripple.resources).to.be.ok
      expect('tertiary' in ripple.resources).to.be.ok
      done()
    })
  })

  it('should load from additional resdirs from command line - shortcut', function(done){  
    process.argv = [
      0
    , 0
    , '-r'
    , './tertiary,./secondary'
    ]

    var ripple = resdir(fn(core()))
    ripple.on('ready', d => {
      expect('data' in ripple.resources).to.be.ok
      expect('secondary' in ripple.resources).to.be.ok
      expect('tertiary' in ripple.resources).to.be.ok
      done()
    })
  })

  it('should load but not watch files in prod', function(done){  
    process.env.NODE_ENV = 'prod'
    var ripple = resdir(fn(css(core())))
    ripple.on('ready', d => {
      expect(loadedResdir[0]).to.eql(ripple)
      expect(loadedResdir[1].name).to.eql('data')
      expect(loadedResdir[1].body).to.eql(String)
      delete global.loadedResdir

      fs.appendFileSync('./resources/data.js', ' ')
      ripple.once('change', function(){
        throw new Error('this should not be called')
      })

      time(1500, done)
    })
  })
})