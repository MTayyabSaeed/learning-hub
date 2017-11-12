'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = prehtml;

var _client = require('utilise/client');

var _client2 = _interopRequireDefault(_client);

var _attr = require('utilise/attr');

var _attr2 = _interopRequireDefault(_attr);

var _wrap = require('utilise/wrap');

var _wrap2 = _interopRequireDefault(_wrap);

var _all = require('utilise/all');

var _all2 = _interopRequireDefault(_all);

var _key = require('utilise/key');

var _key2 = _interopRequireDefault(_key);

/* istanbul ignore next */
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------
// API: Pre-applies HTML Templates [template=name]
// -------------------------------------------
function prehtml(ripple) {
  if (!_client2.default) return;
  log('creating');

  var render = ripple.render;

  (0, _key2.default)('types.text/html.render', (0, _wrap2.default)(html(ripple)))(ripple);

  ripple.render = function (el) {
    var div,
        html = (0, _attr2.default)(el, 'template');
    if (!html) return render.apply(this, arguments);
    if (html && !ripple(html)) return;
    div = document.createElement('div');
    div.innerHTML = ripple(html);(el.shadowRoot || el).innerHTML = div.innerHTML;
    return render(el);
  };

  return ripple;
}

function html(ripple) {
  return function (res) {
    return (0, _all2.default)('[template="' + res.name + '"]:not([inert])').map(ripple.draw);
  };
}

var log = require('utilise/log')('[ri/prehtml]'),
    err = require('utilise/err')('[ri/prehtml]');