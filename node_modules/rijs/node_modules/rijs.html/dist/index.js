'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = html;

var _includes = require('utilise/includes');

var _includes2 = _interopRequireDefault(_includes);

/* istanbul ignore next */
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------
// Exposes a convenient global instance
// -------------------------------------------
function html(ripple) {
  log('creating');
  ripple.types['text/html'] = {
    header: 'text/html',
    check: function check(res) {
      return (0, _includes2.default)('.html')(res.name);
    }
  };

  return ripple;
}

var log = require('utilise/log')('[ri/types/html]');