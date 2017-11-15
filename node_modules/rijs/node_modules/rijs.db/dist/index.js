'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = db;

var _header = require('utilise/header');

var _header2 = _interopRequireDefault(_header);

var _values = require('utilise/values');

var _values2 = _interopRequireDefault(_values);

var _noop = require('utilise/noop');

var _noop2 = _interopRequireDefault(_noop);

var _keys = require('utilise/keys');

var _keys2 = _interopRequireDefault(_keys);

var _not = require('utilise/not');

var _not2 = _interopRequireDefault(_not);

var _is = require('utilise/is');

var _is2 = _interopRequireDefault(_is);

var _to = require('utilise/to');

var _to2 = _interopRequireDefault(_to);

/* istanbul ignore next */
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------
// Pipe resources to/from another source
// -------------------------------------------
function db(ripple) {
  /* istanbul ignore next */
var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _ref$db = _ref.db;
  var db = _ref$db === undefined ? {} : _ref$db;

  log('creating');
  ripple.on('change.db', crud(ripple));
  ripple.adaptors = ripple.adaptors || {};
  ripple.connections = (0, _keys2.default)(db).map(function (k) {
    return connect(ripple)(k, db[k]);
  }).reduce(_to2.default.obj, {});
  return ripple;
}

var connect = function connect(ripple) {
  return function (id, config) {
    if (!config) return { id: id, invalid: err('no connection string', id) };

    _is2.default.str(config) && (config = {
      type: (config = config.split('://')).shift(),
      user: (config = config.join('://').split(':')).shift(),
      database: (config = config.join(':').split('/')).pop(),
      port: (config = config.join('/').split(':')).pop(),
      host: (config = config.join(':').split('@')).pop(),
      password: config.join('@')
    });

    if ((0, _values2.default)(config).some((0, _not2.default)(Boolean))) return { id: id, invalid: err('incorrect connection string', id, config) };

    var connection = (ripple.adaptors[config.type] || _noop2.default)(config);

    return connection ? (connection.id = id, connection) : { id: id, invalid: err('invalid connection', id) };
  };
};

var crud = function crud(ripple) {
  return function (name, change) {
    var _ref2 = change || {};

    var key = _ref2.key;
    var value = _ref2.value;
    var type = _ref2.type;
    var res = ripple.resources[name];

    if (!(0, _header2.default)('content-type', 'application/data')(res)) return;
    if ((0, _header2.default)('silentdb')(res)) return delete res.headers.silentdb;
    if (!type) return;
    var updated = (0, _values2.default)(ripple.connections).filter(function (con) {
      return con.change && con.change(type)(res, change);
    }).map(function (d) {
      return d.id;
    });

    if (updated.length) log('crud', type, name, updated.join(',').grey);
  };
};

var err = require('utilise/err')('[ri/db]'),
    log = require('utilise/log')('[ri/db]');