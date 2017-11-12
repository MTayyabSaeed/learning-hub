'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = features;

var _includes = require('utilise/includes');

var _includes2 = _interopRequireDefault(_includes);

var _client = require('utilise/client');

var _client2 = _interopRequireDefault(_client);

var _header = require('utilise/header');

var _header2 = _interopRequireDefault(_header);

var _append = require('utilise/append');

var _append2 = _interopRequireDefault(_append);

var _attr = require('utilise/attr');

var _attr2 = _interopRequireDefault(_attr);

var _from = require('utilise/from');

var _from2 = _interopRequireDefault(_from);

var _not = require('utilise/not');

var _not2 = _interopRequireDefault(_not);

var _str = require('utilise/str');

var _str2 = _interopRequireDefault(_str);

var _key = require('utilise/key');

var _key2 = _interopRequireDefault(_key);

var _by = require('utilise/by');

var _by2 = _interopRequireDefault(_by);

var _is = require('utilise/is');

var _is2 = _interopRequireDefault(_is);

/* istanbul ignore next */
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------
// Extend Components with Features
// -------------------------------------------
function features(ripple) {
  if (!_client2.default) return;
  log('creating');
  ripple.render = render(ripple)(ripple.render);
  return ripple;
}

var render = function render(ripple) {
  return function (next) {
    return function (el) {
      var features = (0, _str2.default)((0, _attr2.default)(el, 'is')).split(' ').map((0, _from2.default)(ripple.resources)).filter((0, _header2.default)('content-type', 'application/javascript')),
          css = (0, _str2.default)((0, _attr2.default)('css')(el)).split(' ');

      features.filter((0, _by2.default)('headers.needs', (0, _includes2.default)('[css]'))).map((0, _key2.default)('name')).map((0, _append2.default)('.css')).filter((0, _not2.default)(_is2.default.in(css))).map(function (d) {
        return (0, _attr2.default)('css', ((0, _str2.default)((0, _attr2.default)('css')(el)) + ' ' + d).trim())(el);
      });

      var node = next(el);

      return !node || !node.state ? undefined : (features.map((0, _key2.default)('body')).map(function (d) {
        return d.call(node.shadowRoot || node, node.shadowRoot || node, node.state);
      }), node);
    };
  };
};

var log = require('utilise/log')('[ri/features]');