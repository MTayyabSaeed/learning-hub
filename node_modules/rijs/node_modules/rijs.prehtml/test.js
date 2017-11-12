var expect = require('chai').expect
  , noop = require('utilise/noop')
  , components = require('rijs.components').default
  , core = require('rijs.core').default
  , html = require('rijs.html').default
  , fn = require('rijs.fn').default
  , prehtml = require('./').default
  , container = document.createElement('div')
  , el
  
describe('HTML Templates', function(){

  before(function(){
    document.body.appendChild(container)
  })
  
  beforeEach(function(done){
    container.innerHTML = '<html-1></html-1>'
                        + '<html-2 template="foo.html"></html-2>'

    el = container.children[1]
    setTimeout(done, 50)
  })

  after(function(){
    document.body.removeChild(container)
  })

  it('should render component with template loaded', function(){  
    var ripple = prehtml(components(fn(html(core()))))
      , result

    ripple('foo.html', '<li>Hi!</li>')
    ripple('html-2', function(){ result = true })
    ripple.render(el)

    expect(result).to.be.ok
    expect(el.innerHTML).to.equal('<li>Hi!</li>')
  })

  it('should render component when template becomes available', function(done){  
    var ripple = prehtml(components(fn(html(core()))))
      , result = 0

    ripple('html-2', function(){ result++ })

    setTimeout(function(){
      ripple('foo.html', '<li>Hi!</li>')
    }, 50)
    
    setTimeout(function(){
      expect(result).to.equal(1)
      expect(el.innerHTML).to.equal('<li>Hi!</li>')
      done()
    }, 150)
  })

  it('should render component with no template dep', function(){  
    var ripple = prehtml(components(fn(html(core()))))
      , result

    ripple('html-1', function(){ result = true })
    ripple.render(container.children[0])

    expect(result).to.be.ok
  })

  it('should not render component with template not loaded', function(){  
    var ripple = prehtml(components(fn(html(core()))))
      , result

    ripple('html-2', function(){ result = true })
    ripple.render(el)

    expect(result).to.not.be.ok
  })

})