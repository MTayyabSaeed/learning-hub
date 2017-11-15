'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = backpressure;

var _from = require('utilise/from');

var _from2 = _interopRequireDefault(_from);

var _includes = require('utilise/includes');

var _includes2 = _interopRequireDefault(_includes);

var _identity = require('utilise/identity');

var _identity2 = _interopRequireDefault(_identity);

var _flatten = require('utilise/flatten');

var _flatten2 = _interopRequireDefault(_flatten);

var _unique = require('utilise/unique');

var _unique2 = _interopRequireDefault(_unique);

var _values = require('utilise/values');

var _values2 = _interopRequireDefault(_values);

var _client = require('utilise/client');

var _client2 = _interopRequireDefault(_client);

var _ready = require('utilise/ready');

var _ready2 = _interopRequireDefault(_ready);

var _group = require('utilise/group');

var _group2 = _interopRequireDefault(_group);

var _split = require('utilise/split');

var _split2 = _interopRequireDefault(_split);

var _attr = require('utilise/attr');

var _attr2 = _interopRequireDefault(_attr);

var _noop = require('utilise/noop');

var _noop2 = _interopRequireDefault(_noop);

var _not = require('utilise/not');

var _not2 = _interopRequireDefault(_not);

var _all = require('utilise/all');

var _all2 = _interopRequireDefault(_all);

var _key = require('utilise/key');

var _key2 = _interopRequireDefault(_key);

var _is = require('utilise/is');

var _is2 = _interopRequireDefault(_is);

var _by = require('utilise/by');

var _by2 = _interopRequireDefault(_by);

var _lo = require('utilise/lo');

var _lo2 = _interopRequireDefault(_lo);

/* istanbul ignore next */
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------
// Applies backpressure on the flow of streams
// -------------------------------------------
function backpressure(ripple) {
  log('creating');
  if (!ripple.io) return ripple;
  if (_client2.default) {
    ripple.render = render(ripple)(ripple.render);
    ripple.pull = pull(ripple);
    ripple.deps = deps;
    ripple.requested = {};
    ripple.io.on('connect', refresh(ripple));
    ripple.io.on('reconnect', reconnect(ripple));
    (0, _ready2.default)(start(ripple));
    return ripple;
  }

  ripple.to = limit(ripple.to);
  ripple.from = track(ripple)(ripple.from);
  ripple.io.use(function (socket, next) {
    socket.deps = {}, next();
  });
  return ripple;
}

var start = function start(ripple) {
  return function (d) {
    return scan(ripple)(document.body);
  };
};

var scan = function scan(ripple) {
  return function (el) {
    return !el ? undefined : ((0, _all2.default)('*', el).filter((0, _by2.default)('nodeName', (0, _includes2.default)('-'))).filter((0, _by2.default)('nodeName', function (d) {
      return !_is2.default.in(ripple.requested)((0, _lo2.default)(d));
    })).map(ripple.draw), el);
  };
};

var track = function track(ripple) {
  return function (next) {
    return function (req, res) {
      var name = req.name,
          type = req.type,
          socket = req.socket,
          send = ripple.send,
          exists = name in socket.deps;


      if (!(name in ripple.resources)) return;
      if (type === 'pull') {
        socket.deps[name] = 1;
        send(socket)(name);
      }
      return (next || _identity2.default)(req, res);
    };
  };
};

var reconnect = function reconnect(_ref) {
  var io = _ref.io;
  return function (d) {
    return io.io.disconnect(), io.io.connect();
  };
};

var refresh = function refresh(ripple) {
  return function (d) {
    return (0, _group2.default)('refreshing', function (d) {
      return (0, _values2.default)(ripple.resources).map(function (d) {
        return d.name;
      }).map(ripple.pull);
    });
  };
};

var pull = function pull(ripple) {
  return function (name, node) {
    if (node instanceof Element) {
      var original = (0, _attr2.default)('data')(node) || '';
      if (!original.split(' ').some((0, _is2.default)(name))) (0, _attr2.default)('data', (original + ' ' + name).trim())(node);
    }

    if (!(name in ripple.requested)) {
      log('pulling', name);
      ripple.requested[name] = ripple.send({ name: name, type: 'pull' });
    }

    return name in ripple.resources ? promise(ripple(name)) : ripple.requested[name];
  };
};

var limit = function limit(next) {
  return function (req) {
    return req.name in req.socket.deps ? (next || _identity2.default)(req) : false;
  };
};

var deps = function deps(el) {
  return format([(0, _key2.default)('nodeName'), (0, _attr2.default)('data'), (0, _attr2.default)('css'), (0, _attr2.default)('is')])(el);
};

var format = function format(arr) {
  return function (el) {
    return arr.map(function (extract) {
      return extract(el);
    }).filter(Boolean).map(_lo2.default).map((0, _split2.default)(' ')).reduce(_flatten2.default, []).filter(_unique2.default);
  };
};

var render = function render(ripple) {
  return function (next) {
    return function (el) {
      return ripple.deps(el).filter((0, _not2.default)(_is2.default.in(ripple.requested))).map(ripple.pull).length ? false : scan(ripple)(next(el));
    };
  };
};

var log = require('utilise/log')('[ri/back]'),
    err = require('utilise/err')('[ri/back]');