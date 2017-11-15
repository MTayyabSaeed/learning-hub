'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sync;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _identity = require('utilise/identity');

var _identity2 = _interopRequireDefault(_identity);

var _promise = require('utilise/promise');

var _promise2 = _interopRequireDefault(_promise);

var _values = require('utilise/values');

var _values2 = _interopRequireDefault(_values);

var _extend = require('utilise/extend');

var _extend2 = _interopRequireDefault(_extend);

var _header = require('utilise/header');

var _header2 = _interopRequireDefault(_header);

var _client = require('utilise/client');

/* istanbul ignore next */
var _client2 = _interopRequireDefault(_client);

var _clone = require('utilise/clone');

var _clone2 = _interopRequireDefault(_clone);

var _noop = require('utilise/noop');

/* istanbul ignore next */
var _noop2 = _interopRequireDefault(_noop);

var _keys = require('utilise/keys');

var _keys2 = _interopRequireDefault(_keys);

var _not = require('utilise/not');

var _not2 = _interopRequireDefault(_not);

var _str = require('utilise/str');

var _str2 = _interopRequireDefault(_str);

var _set = require('utilise/set');

var _set2 = _interopRequireDefault(_set);

var _def = require('utilise/def');

var _def2 = _interopRequireDefault(_def);

var _key = require('utilise/key');

var _key2 = _interopRequireDefault(_key);

var _by = require('utilise/by');

var _by2 = _interopRequireDefault(_by);

var _is = require('utilise/is');

var _is2 = _interopRequireDefault(_is);

var _to = require('utilise/to');

/* istanbul ignore next */
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------
// Synchronises resources between server/client
// -------------------------------------------
function sync(ripple) {
  var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var server = _ref.server;
  var port = _ref.port;

  log('creating');
/* istanbul ignore next */
  if (!_client2.default) {
    ripple.to = clean(ripple.to);
    (0, _values2.default)(ripple.types).map(function (type) {
      return type.parse = headers(ripple)(type.parse);
    });
    server = (0, _def2.default)(ripple, 'server', server || (0, _express2.default)().listen(port, function (d) {
      return log('listening', server.address().port);
    }));
    server.express = (0, _key2.default)('_events.request')(server) || server.on('request', (0, _express2.default)())._events.request;
  }

  (0, _def2.default)(ripple, 'io', io(server));
  ripple.io.use(ip);
  ripple.req = send(ripple)(ripple);
/* istanbul ignore next */
  ripple.send = _client2.default ? send(ripple)(ripple.io) : send(ripple);
  ripple.on('change.send', broadcast(ripple));
  ripple.io.on('change', consume(ripple));
  ripple.io.on('connection', connected(ripple));
  return ripple;
}

var connected = function connected(ripple) {
  return function (socket) {
    log('connected'.green, (0, _str2.default)(socket.ip).grey);
    socket.on('change', consume(ripple));
    ripple.send(socket)();
  };
};

var broadcast = function broadcast(ripple) {
  return function (name, change) {
/* istanbul ignore next */
    (_client2.default ? ripple.send : ripple.send())((0, _extend2.default)({ name: name })(change || {}));
  };
};

var normalize = function normalize(ripple) {
  var next = arguments.length <= 1 || arguments[1] === undefined ? _identity2.default : arguments[1];
  return function (name, type, value) {
    var req = _is2.default.obj(name) ? name : { name: name, type: type, value: value },
        resource = ripple.resources[req.name];

    if (!req.name) return next((0, _values2.default)(ripple.resources).map(normalize(ripple)));

    // if (!resource)
    //   return Promise.resolve([404, err(`cannot find ${req.name}`)])

    if (!req.type) req = {
      name: req.name,
      type: 'update',
      headers: resource.headers,
      value: resource.body,
      time: now(resource)
    };

    if (req.type == 'update' && !req.key) req.headers = resource.headers;

    return next(req);
  };
};

// send all or some req, to all or some sockets
var send = function send(ripple) {
  var l = arguments.length <= 1 || arguments[1] === undefined ? log : arguments[1];
  return function (who) {
    return normalize(ripple, function (req) {
      var count = function count(sent) {
        return (0, _str2.default)(sent.length).green.bold + '/' + (0, _str2.default)(everyone.length).green;
      },
          all = function all(d) {
        return req.length && log('send'.grey, count(sockets), 'all'.bold, ('(' + req.length + ')').grey);
      },
/* istanbul ignore next */
          everyone = _client2.default ? [ripple.io] : (0, _values2.default)(ripple.io.of('/').sockets),
          sockets = _is2.default.arr(who) ? who : _is2.default.str(who) ? everyone.filter((0, _by2.default)('sessionID', who)) : !who ? everyone : [who],
/* istanbul ignore next */
          promises = _is2.default.arr(req) ? (all(), req.map(send(ripple, l = _noop2.default)(sockets))) : sockets.map(function (s) {
        return to(ripple, req, s);
      }).filter(Boolean);

      if (promises.length) l('send'.grey, count(promises), req.name);
      return Promise.all(promises);
    });
  };
};

// outgoing transforms
var to = function to(ripple, req, socket, resource) {
  if ((0, _header2.default)('silent', socket)(resource = ripple.resources[req.name])) return delete resource.headers.silent, false;

  var nametype = '(' + req.name + ', ' + req.type + ')',
      xres = (0, _header2.default)('to')(resource) || _identity2.default,
      xtyp = type(ripple)(resource).to || _identity2.default,
      xall = ripple.to || _identity2.default,
      p = (0, _promise2.default)();

  Promise.resolve(xall((0, _extend2.default)({ socket: socket })(req))).then(function (req) {
    return req && xtyp(req);
  }).then(function (req) {
    return req && xres(req);
  }).then(function (req) {
    return !strip(req) ? p.resolve([false]) : socket == ripple ? consume(ripple)(req, res) : socket.emit('change', req, res);
  }).catch(function (e) {
    throw new Error(err('to failed'.red, e));
  });

  return p;

  function res() {
    deb('ack'.grey, nametype, (0, _str2.default)(socket.ip).grey);
    p.resolve((0, _to.arr)(arguments));
  }
};

// incoming transforms
var consume = function consume(ripple) {
  return function (req) {
/* istanbul ignore next */
    var res = arguments.length <= 1 || arguments[1] === undefined ? _noop2.default : arguments[1];

    var nametype = '(' + req.name + ', ' + req.type + ')',
        resource = ripple.resources[req.name],
        silent = silence(req.socket = this),
        xres = (0, _header2.default)('from')(resource) || _identity2.default,
        xtyp = type(ripple)(resource).from || _identity2.default,
        xall = ripple.from || _identity2.default;

    log('recv'.grey, nametype);
    try {
      !req.name ? res(404, err('not found'.red, req.name)) : !(req = xall(req, res)) ? deb('skip', 'global', nametype) : !(req = xtyp(req, res)) ? deb('skip', 'type', nametype) : !(req = xres(req, res)) ? deb('skip', 'resource', nametype) : !req.key && req.type == 'update' ? (ripple(silent(body(req))), res(200, deb('ok ' + nametype))) : isStandardVerb(req.type) ? ((0, _set2.default)(req)(silent(resource).body), res(200, deb('ok ' + nametype, _key2.default.grey))) : !isStandardVerb(req.type) ? res(405, deb('method not allowed', nametype)) : res(400, deb('cannot process', nametype));
    } catch (e) {
      res(e.status || 500, err(e.message, nametype, '\n', e.stack));
    }
  };
};

var body = function body(_ref2) {
  var name = _ref2.name;
  var _body = _ref2.body;
  var value = _ref2.value;
  var headers = _ref2.headers;
  return { name: name, headers: headers, body: value };
};

var headers = function headers(ripple) {
  return function (next) {
    return function (res) {
      var existing = ripple.resources[res.name],
          from = (0, _header2.default)('from')(res) || (0, _header2.default)('from')(existing),
          to = (0, _header2.default)('to')(res) || (0, _header2.default)('to')(existing);
      if (from) res.headers.from = from;
      if (to) res.headers.to = to;
      return next ? next(res) : res;
    };
  };
};

var io = function io(server) {
/* istanbul ignore next */
  var transports = _client2.default && document.currentScript && document.currentScript.getAttribute('transports') && document.currentScript.getAttribute('transports').split(',') || undefined;

/* istanbul ignore next */
  var r = !_client2.default ? require('socket.io')(server) : window.io ? window.io({ transports: transports }) : _is2.default.fn(require('socket.io-client')) ? require('socket.io-client')({ transports: transports }) : { on: _noop2.default, emit: _noop2.default };
/* istanbul ignore next */
  r.use = r.use || _noop2.default;
  return r;
};

var ip = function ip(socket, next) {
  socket.ip = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;
  next();
};

var strip = function strip(req) {
  return delete req.socket, req;
};

var clean = function clean(next) {
  return function (req, res) {
    if (_is2.default.obj(req.value)) try {
      req.value = (0, _clone2.default)(req.value);
    } catch (e) {
      err('cannot send circular structure');
      return false;
    }

    if (!req.headers || !req.headers.silent) return (next || _identity2.default)(req, res);

    var stripped = {};

    (0, _keys2.default)(req.headers).filter((0, _not2.default)((0, _is2.default)('silent'))).map(function (header) {
      return stripped[header] = req.headers[header];
    });

    req.headers = stripped;
    return (next || _identity2.default)(req, res);
  };
};

var type = function type(ripple) {
  return function (res) {
    return ripple.types[(0, _header2.default)('content-type')(res)] || {};
  };
},
    now = function now(d, t) {
  return t = (0, _key2.default)('body.log.length')(d), _is2.default.num(t) ? t - 1 : t;
},
    silence = function silence(socket) {
  return function (res) {
    return (0, _key2.default)('headers.silent', socket)(res);
  };
},
    isStandardVerb = _is2.default.in(['update', 'add', 'remove']),
    log = require('utilise/log')('[ri/sync]'),
    err = require('utilise/err')('[ri/sync]'),
    deb = require('utilise/deb')('[ri/sync]');