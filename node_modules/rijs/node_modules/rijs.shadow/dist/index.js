'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = shadow;

var _client = require('utilise/client');

var _client2 = _interopRequireDefault(_client);

var _keys = require('utilise/keys');

var _keys2 = _interopRequireDefault(_keys);

var _is = require('utilise/is');

var _is2 = _interopRequireDefault(_is);

/* istanbul ignore next */
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------
// Adds Shadow DOM Encapsulation into Rendering Pipeline
// -------------------------------------------
function shadow(ripple) {
  if (!_client2.default) return;
  log('creating', document.head.createShadowRoot ? 'encapsulation' : 'closing gap');
  ripple.render = render(ripple.render);
  return ripple;
}

var render = function render(next) {
  return function (el) {
    el.createShadowRoot ? !el.shadowRoot && el.createShadowRoot() && retarget(reflect(el)) : (el.shadowRoot = el, el.shadowRoot.host = el);

    return next(el);
  };
};

var reflect = function reflect(el) {
  return el.shadowRoot.innerHTML = el.innerHTML, el.innerHTML = '', el;
};

var retarget = function retarget(el) {
  return (0, _keys2.default)(el).concat(['on', 'once', 'emit', 'classList', 'getAttribute', 'setAttribute', 'hasAttribute', 'removeAttribute', 'closest']).map(function (d) {
    return _is2.default.fn(el[d]) ? el.shadowRoot[d] = el[d].bind(el) : Object.defineProperty(el.shadowRoot, d, {
      get: function get(z) {
        return el[d];
      },
      set: function set(z) {
        return el[d] = z;
      }
    });
  });
};

var log = require('utilise/log')('[ri/shadow]'),
    err = require('utilise/err')('[ri/shadow]');