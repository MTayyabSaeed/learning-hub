'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = serve;

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _send = require('utilise/send');

var _send2 = _interopRequireDefault(_send);

var _key = require('utilise/key');

var _key2 = _interopRequireDefault(_key);

var _path = require('path');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

/* istanbul ignore next */
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------
// Serves the client library /ripple.js
// -------------------------------------------
function serve(ripple) {
  var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var server = _ref.server;
  var _ref$serve = _ref.serve;
  var serve = _ref$serve === undefined ? __dirname : _ref$serve;

  log('creating');
  server = ripple.server || server;
  if (!server) return ripple;
  var app = expressify(server),
      path = local(serve),
      compress = (0, _compression2.default)();

  app.use('/ripple.js', compress, (0, _send2.default)(path('js')));
  app.use('/ripple.min.js', compress, (0, _send2.default)(path('min.js')));
  app.use('/ripple.pure.js', compress, (0, _send2.default)(path('pure.js')));
  app.use('/ripple.pure.min.js', compress, (0, _send2.default)(path('pure.min.js')));
  return ripple;
}

var expressify = function expressify(server) {
  return server.express || (0, _key2.default)('_events.request')(server) || server.on('request', (0, _express2.default)())._events.request;
};

var local = function local(path) {
  return function (ext) {
    return (0, _path.resolve)(path, './ripple.' + ext);
  };
};

var log = require('utilise/log')('[ri/serve]');