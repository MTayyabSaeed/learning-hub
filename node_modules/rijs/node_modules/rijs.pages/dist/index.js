'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pages;

var _key = require('utilise/key');

var _key2 = _interopRequireDefault(_key);

var _path = require('path');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _serveStatic = require('serve-static');

var _serveStatic2 = _interopRequireDefault(_serveStatic);

/* istanbul ignore next */
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------
// Serves the /pages directory
// -------------------------------------------
function pages(ripple) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      server = _ref.server,
      dir = _ref.dir;

  log('creating');
  server = ripple.server || server;
  if (!server || !dir) return ripple;
  expressify(server).use((0, _serveStatic2.default)((0, _path.resolve)(dir, './pages')));
  return ripple;
}

var expressify = function expressify(server) {
  return server.express || (0, _key2.default)('_events.request')(server) || server.on('request', (0, _express2.default)())._events.request;
};

var log = require('utilise/log')('[ri/pages]');