'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = data;

var _overwrite = require('utilise/overwrite');

var _overwrite2 = _interopRequireDefault(_overwrite);

var _header = require('utilise/header');

var _header2 = _interopRequireDefault(_header);

var _extend = require('utilise/extend');

var _extend2 = _interopRequireDefault(_extend);

var _not = require('utilise/not');

var _not2 = _interopRequireDefault(_not);

var _key = require('utilise/key');

var _key2 = _interopRequireDefault(_key);

var _set = require('utilise/set');

var _set2 = _interopRequireDefault(_set);

var _is = require('utilise/is');

var _is2 = _interopRequireDefault(_is);

/* istanbul ignore next */
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------
// Adds support for data resources
// -------------------------------------------
function data(ripple) {
  log('creating');
  ripple.on('change.data', trickle(ripple));
  ripple.types['application/data'] = {
    header: 'application/data',
    check: function check(res) {
      return _is2.default.obj(res.body) || !res.body ? true : false;
    },
    parse: function parse(res) {
      var existing = ripple.resources[res.name] || {};

      (0, _extend2.default)(res.headers)(existing.headers);
      res.body = (0, _set2.default)()(res.body || [], existing.body && existing.body.log, _is2.default.num(res.headers.log) ? res.headers.log : -1);
      (0, _overwrite2.default)(res.body.on)(listeners(existing));
      res.body.on('change.bubble', function (change) {
        ripple.emit('change', ripple.change = [res.name, change], (0, _not2.default)(_is2.default.in(['data'])));
        delete ripple.change;
      });

      return res;
    }
  };

  return ripple;
}

var trickle = function trickle(ripple) {
  return function (name, change) {
    return (0, _header2.default)('content-type', 'application/data')(ripple.resources[name]) && ripple.resources[name].body.emit('change', [change || null], (0, _not2.default)(_is2.default.in(['bubble'])));
  };
};

var log = require('utilise/log')('[ri/types/data]'),
    listeners = (0, _key2.default)('body.on');