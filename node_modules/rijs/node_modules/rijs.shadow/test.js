var expect = require('chai').expect
  , once = require('utilise/once')
  , noop = require('utilise/noop')
  , time = require('utilise/time')
  , keys = require('utilise/keys')
  , components = require('rijs.components').default
  , core = require('rijs.core').default
  , data = require('rijs.data').default
  , fn = require('rijs.fn').default
  , shadow = require('./').default
  , container = document.createElement('div')
  , el1, el2
  
describe('Shadow DOM', function(){

  before(function(){
    document.body.appendChild(container)
  })

  after(function(){
    document.body.removeChild(container)
  })
  
  beforeEach(function(){
    container.innerHTML = '<component-1></component-1>'
                        + '<component-2>fallback</component-2>'

    el1 = container.children[0]
    el2 = container.children[1]
  })

  it('should encapsulate with shadow dom or polyfill', function(){  
    var ripple = shadow(components(fn(data(core()))))
      , component = function(){ this.innerHTML = 'foo' }

    ripple('component-1', component)
    ripple('component-2', component)
    ripple.render(el1)
    ripple.render(el2)

    expect(el1.shadowRoot.innerHTML).to.be.eql('foo')
    expect(el1).to.be.equal(el1.shadowRoot.host)
  })

  it('should reflect ssr content', function(){  
    var ripple = shadow(components(fn(data(core()))))

    ripple('component-2', noop)
    ripple.render(el1)
    ripple.render(el2)

    expect(el2.shadowRoot.innerHTML).to.be.eql('fallback')
    if (el2.shadowRoot !== el2) 
      expect(el2.innerHTML).to.be.eql('')

  })

  it('should close gap between host data and shadowRoot data', function(){  
    var ripple = shadow(components(fn(data(core()))))

    ripple('component-2', noop)

    el2.__data__ = { foo: 'bar' }
    
    ripple.render(el1)
    ripple.render(el2)

    expect(el2.shadowRoot.__data__).to.be.eql(el2.__data__)
  })

  it('should retarget utility functions', function(done){  
    once(el2)

    var ripple = shadow(components(fn(data(core()))))

    ripple('component-2', noop)

    el2.__data__ = { foo: 'bar' }
    el2.state = { bar: 'foo' }
    
    ripple.render(el2)

    expect(el2.shadowRoot.__data__).to.be.eql(el2.__data__)
    expect(el2.shadowRoot.state).to.be.eql(el2.state)

    expect(el2.shadowRoot.on).to.be.a('function')
    expect(el2.shadowRoot.once).to.be.a('function')
    expect(el2.shadowRoot.emit).to.be.a('function')

    el2.on('foo', function(d, i, el, e){
      expect(d).to.be.eql({ foo: 'bar', bar: 'foo' })
      expect(e.detail).to.be.eql('bar')
      done()
    })

    el2.shadowRoot.emit('foo', 'bar')
  })

  it('should return correct host values inside component', function(done){  
    var ripple = shadow(components(fn(data(core()))))

    el2.change = 1
    ripple('component-2', function(){
      expect(this.change).to.eql(this.host.change)
      el2.change++
    })

    ripple.render(el2)
    ripple.render(el2)

    time(100, done)
  })

  it('should retarget .classed and .attr', function(){
    var ripple = shadow(components(fn(data(core()))))

    ripple('component-2', noop)
    ripple.render(el2)

    var root = el2.shadowRoot

    // expect(root.classList).to.be.eql(el2.classList)
    expect(root.getAttribute).to.be.a('function')
    expect(root.setAttribute).to.be.a('function')
    expect(root.hasAttribute).to.be.a('function')
    expect(root.removeAttribute).to.be.a('function')
    expect(root.closest).to.be.a('function')

    if (el2.classList) {
      expect(el2.className).to.be.eql('')
      root.classList.add('foo')
      expect(el2.className).to.be.eql('foo')
      root.classList.remove('foo')
      expect(el2.className).to.be.eql('')
    }

    expect(el2.getAttribute('foo')).to.be.eql(null)
    expect(root.getAttribute('foo')).to.be.eql(null)
    root.setAttribute('foo', 'bar')

    expect(el2.getAttribute('foo')).to.be.eql('bar')
    expect(root.getAttribute('foo')).to.be.eql('bar')
  })

  it('should make shadow properties setter transparent', function(){  
    var ripple = shadow(components(fn(data(core()))))

    el2.foo = true
    ripple('component-2', noop)
    ripple.render(el2)

    el2.foo = 10
    expect(el2.shadowRoot.foo).to.eql(10)

    el2.shadowRoot.foo = 20
    expect(el2.foo).to.eql(20)
  })

})