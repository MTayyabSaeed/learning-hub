'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = offline;

var _debounce = require('utilise/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _header = require('utilise/header');

var _header2 = _interopRequireDefault(_header);

var _client = require('utilise/client');

var _client2 = _interopRequireDefault(_client);

var _values = require('utilise/values');

var _values2 = _interopRequireDefault(_values);

var _clone = require('utilise/clone');

var _clone2 = _interopRequireDefault(_clone);

var _parse = require('utilise/parse');

var _parse2 = _interopRequireDefault(_parse);

var _group = require('utilise/group');

var _group2 = _interopRequireDefault(_group);

var _not = require('utilise/not');

var _not2 = _interopRequireDefault(_not);

var _str = require('utilise/str');

var _str2 = _interopRequireDefault(_str);

/* istanbul ignore next */
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------
// API: Cache to and Restore from localStorage
// -------------------------------------------
function offline(ripple) {
  if (!_client2.default || !window.localStorage) return;
  log('creating');
  load(ripple);
  ripple.on('change.cache', (0, _debounce2.default)(1000)(cache(ripple)));
  return ripple;
}

var load = function load(ripple) {
  return (0, _group2.default)('loading cache', function (d) {
    return ((0, _parse2.default)(localStorage.ripple) || []).map(ripple);
  });
};

var cache = function cache(ripple) {
  return function (res) {
    log('cached');
    var cachable = (0, _values2.default)((0, _clone2.default)(ripple.resources)).filter((0, _not2.default)((0, _header2.default)('cache', 'no-store')));

    cachable.filter((0, _header2.default)('content-type', 'application/javascript')).map(function (d) {
      return d.body = (0, _str2.default)(ripple.resources[d.name].body);
    });

    localStorage.ripple = (0, _str2.default)(cachable);
  };
};

var log = require('utilise/log')('[ri/offline]'),
    err = require('utilise/err')('[ri/offline]');