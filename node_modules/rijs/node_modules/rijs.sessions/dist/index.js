'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sessions;

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _client = require('utilise/client');

var _client2 = _interopRequireDefault(_client);

var _noop = require('utilise/noop');

var _noop2 = _interopRequireDefault(_noop);

var _key = require('utilise/key');

var _key2 = _interopRequireDefault(_key);

/* istanbul ignore next */
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------
// Populates sessionID on each connection
// -------------------------------------------
function sessions(ripple) {
  var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var secret = _ref.secret;
  var name = _ref.name;

  log('creating');
  if (!secret || !name) return ripple;
  ripple.io.use(auth(secret, name));
  return ripple;
}

var log = require('utilise/log')('[ri/sessions]'),
    auth = function auth(secret, name) {
  return function (socket, next) {
    var req = {};
    (0, _key2.default)('headers.cookie', socket.request.headers.cookie)(req);
    (0, _cookieParser2.default)(secret)(req, null, _noop2.default);
    socket.sessionID = req.signedCookies[name] || req.cookies[name];
    next();
  };
};