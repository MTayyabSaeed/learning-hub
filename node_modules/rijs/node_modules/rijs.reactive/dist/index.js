'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reactive;

var _header = require('utilise/header');

var _header2 = _interopRequireDefault(_header);

var _keys = require('utilise/keys');

var _keys2 = _interopRequireDefault(_keys);

var _str = require('utilise/str');

var _str2 = _interopRequireDefault(_str);

var _not = require('utilise/not');

var _not2 = _interopRequireDefault(_not);

var _def = require('utilise/def');

var _def2 = _interopRequireDefault(_def);

var _has = require('utilise/has');

var _has2 = _interopRequireDefault(_has);

var _is = require('utilise/is');

var _is2 = _interopRequireDefault(_is);

/* istanbul ignore next */
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------
// API: React to data changes - deprecates explicit .emit('change')
// -------------------------------------------
function reactive(ripple) {
  log('creating');
  ripple.on('change.reactive', react(ripple));
  return ripple;
}

function react(ripple) {
  return function (res) {
    if (!_is2.default.obj(res.body)) return;
    if ((0, _header2.default)('reactive', false)(res)) return;
    if (res.body.observer) return;
    if (!Object.observe) return polyfill(ripple)(res);

    Array.observe(res.body, (0, _def2.default)(res.body, 'observer', changed(ripple)(res)));

    _is2.default.arr(res.body) && res.body.forEach(observe(ripple)(res));
  };
}

function observe(ripple) {
  return function (res) {
    return function (d) {
      if (!_is2.default.obj(d)) return;
      if (d.observer) return;
      var fn = child(ripple)(res);
      (0, _def2.default)(d, 'observer', fn);
      Object.observe(d, fn);
    };
  };
}

function child(ripple) {
  return function (res) {
    return function (changes) {
      var key = res.body.indexOf(changes[0].object),
          value = res.body[key],
          type = 'update',
          change = { key: key, value: value, type: type };

      log('changed (c)'.green, res.name.bold, (0, _str2.default)(key).grey, debug ? changes : '');
      ripple.emit('change', [res, change], (0, _not2.default)(_is2.default.in(['reactive'])));
    };
  };
}

function changed(ripple) {
  return function (res) {
    return function (changes) {
      changes.map(normalize).filter(Boolean).map(function (change) {
        return log('changed (p)'.green, res.name.bold, change.key.grey), change;
      }).map(function (change) {
        return _is2.default.arr(res.body) && change.type == 'push' && observe(ripple)(res)(change.value), change;
      }).map(function (change) {
        return ripple.emit('change', [res, change], (0, _not2.default)(_is2.default.in(['reactive'])));
      });
    };
  };
}

function polyfill(ripple) {
  return function (res) {
    if (!ripple.observer) ripple.observer = setInterval(check(ripple), 100);
    if (!ripple.cache) ripple.cache = {};
    ripple.cache[res.name] = (0, _str2.default)(res.body);
  };
}

function check(ripple) {
  return function () {
    if (!ripple || !ripple.resources) return clearInterval(ripple.observer);
    (0, _keys2.default)(ripple.cache).forEach(function (name) {
      var res = ripple.resources[name];
      if (ripple.cache[name] != (0, _str2.default)(res.body)) {
        log('changed (x)', name);
        ripple.cache[name] = (0, _str2.default)(res.body);
        ripple.emit('change', [res], (0, _not2.default)(_is2.default.in(['reactive'])));
      }
    });
  };
}

// normalize a change
function normalize(change) {
  var type = change.type,
      removed = type == 'delete' ? change.oldValue : change.removed && change.removed[0],
      data = change.object,
      key = change.name || (0, _str2.default)(change.index),
      value = data[key],
      skip = type == 'update' && (0, _str2.default)(value) == (0, _str2.default)(change.oldValue),
      details = {
    key: key,
    value: removed || value,
    type: type == 'update' ? 'update' : type == 'delete' ? 'remove' : type == 'splice' && removed ? 'remove' : type == 'splice' && !removed ? 'push' : type == 'add' ? 'push' : false
  };

  if (skip) return log('skipping update'), false;
  return details;
}

var log = require('utilise/log')('[ri/reactive]'),
    err = require('utilise/err')('[ri/reactive]'),
    debug = false;