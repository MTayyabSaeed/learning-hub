'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hypermedia;

var _includes = require('utilise/includes');

var _includes2 = _interopRequireDefault(_includes);

var _header = require('utilise/header');

var _header2 = _interopRequireDefault(_header);

var _extend = require('utilise/extend');

var _extend2 = _interopRequireDefault(_extend);

var _parse = require('utilise/parse');

var _parse2 = _interopRequireDefault(_parse);

var _wait = require('utilise/wait');

var _wait2 = _interopRequireDefault(_wait);

var _noop = require('utilise/noop');

var _noop2 = _interopRequireDefault(_noop);

var _keys = require('utilise/keys');

var _keys2 = _interopRequireDefault(_keys);

var _key = require('utilise/key');

var _key2 = _interopRequireDefault(_key);

var _not = require('utilise/not');

var _not2 = _interopRequireDefault(_not);

var _is = require('utilise/is');

var _is2 = _interopRequireDefault(_is);

var _fn = require('utilise/fn');

var _fn2 = _interopRequireDefault(_fn);

var _to = require('utilise/to');

var _to2 = _interopRequireDefault(_to);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

/* istanbul ignore next */
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------
// Enables following hypermedia links
// -------------------------------------------
function hypermedia(ripple) {
  log('creating');
  ripple.on("change.hypermedia", trickle(ripple));
  ripple.types['application/hypermedia'] = {
    header: 'application/hypermedia',
    render: (0, _key2.default)('types.application/data.render')(ripple),
    priority: 10,
    check: function check(res) {
      return (0, _header2.default)('content-type', 'application/hypermedia')(ripple.resources[res.name]) || isURL(res.body) || parent(ripple)(res.headers.link) || parent(ripple)(res.name) && !(0, _includes2.default)('.css')(res.name);
    },
    parse: function parse(res) {
      var name = res.name,
          body = res.body,
          nearest = parent(ripple)(name),
          sup = ripple.types['application/data'].parse,
          register = function register(r) {
        return ripple({ name: name, body: body });
      },
          isLoaded = loaded(ripple),
          timestamp = new Date();

      if (isLoaded(name)()) return sup(res);

      if (res.headers.link) return ripple(res.headers.link, res.body).once('change', (0, _wait2.default)(isLoaded(res.headers.link))(function (r) {
        return ripple(name, r, { timestamp: timestamp });
      })), sup(res);

      if (isURL(res.body)) res.headers.url = res.body;

      if (nearest && ripple.resources[nearest].headers.http) res.headers.http = ripple.resources[nearest].headers.http;

      if (!_is2.default.obj(res.body)) res.body = {};

      if (res.headers.url) return (0, _request2.default)(opts(res.headers.url, res.headers.http), fetched(ripple)(res)), sup(res);

      if (nearest && !ripple.resources[nearest].headers.timestamp) return ripple(nearest).once('change', (0, _wait2.default)(isLoaded(nearest))(register)), debug('parent not loaded yet'), sup(res);

      if (nearest) {
        var parts = subtract(name, nearest),
            value;

        for (var i = 1; i < parts.length + 1; i++) {
          var path = parts.slice(0, i).join('.'),
              next = [nearest, path].join('.');
          value = (0, _key2.default)(path)(ripple(nearest));

          if (isURL(value)) {
            ripple(next, expand(value, res.body));
            if (next != name) ripple(next).once('change', (0, _wait2.default)(isLoaded(nearest))(register));
            return debug('loading link'), sup(res);
          }
        }

        res.headers.timestamp = timestamp;
        res.body = _is2.default.obj(value) ? value : { value: value };
        log('loaded'.green, name);
        return sup(res);
      }

      return sup(res);
    }
  };

  return ripple;
}

var log = require('utilise/log')('[ri/hypermedia]'),
    err = require('utilise/err')('[ri/hypermedia]'),
    debug = _noop2.default;

function expand(url, params) {
  (0, _keys2.default)(params).map(function (k) {
    url = url.replace('{' + k + '}', params[k]);
    url = url.replace('{/' + k + '}', '/' + params[k]);
  });

  url = url.replace(/\{.+?\}/g, '');
  debug('url', url);
  return url;
}

function parent(ripple) {
  return function (key) {
    if (!key) return false;
    var parts = key.split('.');
    for (var i = parts.length - 1; i > 0; i--) {
      var candidate = parts.slice(0, i).join('.');
      if (candidate in ripple.resources) return candidate;
    }
  };
}

function subtract(a, b) {
  return a.slice(b.length + 1).split('.');
}

function loaded(ripple) {
  return function (name) {
    return function (r) {
      return ripple.resources[name] && ripple.resources[name].headers.timestamp;
    };
  };
}

function isURL(d) {
  return (0, _includes2.default)('://')(d);
}

function opts(url, headers) {
  return { url: url, headers: (0, _extend2.default)({ 'User-Agent': 'request' })(headers) };
}

function fetched(ripple) {
  return function (res, url) {
    return function (e, response, body) {
      body = (0, _parse2.default)(body);
      if (e) return err(e, url);
      if (response.statusCode != 200) return err(body.message, url);
      debug('fetched', res.name);
      ripple.resources[res.name].headers.timestamp = new Date();
      ripple(res.name, body);
    };
  };
}

var trickle = function trickle(ripple) {
  return function (name, change) {
    return (0, _header2.default)('content-type', 'application/hypermedia')(ripple.resources[name]) && ripple.resources[name].body.emit('change', [change || null], (0, _not2.default)(_is2.default.in(['bubble'])));
  };
};