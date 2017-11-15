'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mysql;

var _from = require('utilise/from');

var _from2 = _interopRequireDefault(_from);

var _promise = require('utilise/promise');

var _promise2 = _interopRequireDefault(_promise);

var _prepend = require('utilise/prepend');

var _prepend2 = _interopRequireDefault(_prepend);

var _extend = require('utilise/extend');

var _extend2 = _interopRequireDefault(_extend);

var _append = require('utilise/append');

var _append2 = _interopRequireDefault(_append);

var _keys = require('utilise/keys');

var _keys2 = _interopRequireDefault(_keys);

var _not = require('utilise/not');

var _not2 = _interopRequireDefault(_not);

var _str = require('utilise/str');

var _str2 = _interopRequireDefault(_str);

var _is = require('utilise/is');

var _is2 = _interopRequireDefault(_is);

var _mysql = require('mysql');

/* istanbul ignore next */
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mysql(config) {
  var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  log('creating');

  config = (0, _extend2.default)(opts)({
    type: (config = config.split('://')).shift(),
    user: (config = config.join('://').split(':')).shift(),
    database: (config = config.join(':').split('/')).pop(),
    port: (config = config.join('/').split(':')).pop(),
    host: (config = config.join(':').split('@')).pop(),
    password: config.join('@')
  });

  var con = (0, _mysql.createPool)(config);
  escape = con.escape.bind(con);

  return {
    update: crud(con, 'update'),
    remove: crud(con, 'remove'),
    add: crud(con, 'add'),
    load: load(con)
  };
}

var crud = function crud(con, type) {
  return function (table, body) {
    var p = (0, _promise2.default)(),
        mask = fields[table],
        sql = void 0;

    if (!(sql = sqls[type](table, key(mask)(body)))) return deb('no sql', name);
    log('SQL', sql.grey);

    con.query(sql, function (e, rows) {
      if (e) return err(type, table, 'failed', e);
      log(type.green.bold, table, 'done', rows.insertId ? (0, _str2.default)(rows.insertId).grey : '');
      p.resolve(rows.insertId || body.id);
    });

    return p;
  };
};

var load = function load(con) {
  return function (table) {
    var p = (0, _promise2.default)();

    con.query('SHOW COLUMNS FROM ' + table, function (e, rows) {
      if (e && e.code == 'ER_NO_SUCH_TABLE') return log('no table', table);
      if (e) return err(table, e);
      key(table, rows.map(key('Field')))(fields);

      con.query('SELECT * FROM ' + table, function (e, rows) {
        if (e) return err(table, e);
        log('got'.green, table, (0, _str2.default)(rows.length).grey);
        p.resolve(rows);
      });
    });

    return p;
  };
};

var sqls = {
  add: function add(name, body) {
    return 'INSERT INTO {table} ({keys}) VALUES ({values});'.replace('{table}', name).replace('{keys}', (0, _keys2.default)(body).filter((0, _not2.default)((0, _is2.default)('id'))).map((0, _prepend2.default)('`')).map((0, _append2.default)('`')).join(',')).replace('{values}', (0, _keys2.default)(body).filter((0, _not2.default)((0, _is2.default)('id'))).map((0, _from2.default)(body)).map(escape).join(','));
  },
  update: function update(name, body) {
    return (0, _keys2.default)(body).length == 1 && 'id' in body ? '' : 'UPDATE {table} SET {kvpairs} WHERE id = {id};'.replace('{table}', name).replace('{id}', body['id']).replace('{kvpairs}', (0, _keys2.default)(body).filter((0, _not2.default)((0, _is2.default)('id'))).map(kvpair(body)).join(','));
  },
  remove: function remove(name, body) {
    return 'DELETE FROM {table} WHERE id = {id};'.replace('{table}', name).replace('{id}', body['id']);
  }
};

var kvpair = function kvpair(arr) {
  return function (key) {
    return '`' + key + "`=" + escape(arr[key]);
  };
};

var log = require('utilise/log')('[mysql]'),
    err = require('utilise/err')('[mysql]'),
    deb = require('utilise/deb')('[mysql]'),
    fields = {};
var escape;