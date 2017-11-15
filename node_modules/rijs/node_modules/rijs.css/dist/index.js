'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = css;

var _includes = require('utilise/includes');

var _includes2 = _interopRequireDefault(_includes);

/* istanbul ignore next */
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------
// Exposes a convenient global instance
// -------------------------------------------
function css(ripple) {
  log('creating');
  ripple.types['text/css'] = {
    header: 'text/css',
    check: function check(res) {
      return (0, _includes2.default)('.css')(res.name);
    }
  };

  return ripple;
}

var log = require('utilise/log')('[ri/types/css]');