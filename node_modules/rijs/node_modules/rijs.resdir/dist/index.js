'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resdir;

var _path = require('path');

var _fs = require('fs');

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

var _append = require('utilise/append');

var _append2 = _interopRequireDefault(_append);

var _values = require('utilise/values');

var _values2 = _interopRequireDefault(_values);

var _file = require('utilise/file');

var _file2 = _interopRequireDefault(_file);

var _def = require('utilise/def');

var _def2 = _interopRequireDefault(_def);

var _is = require('utilise/is');

var _is2 = _interopRequireDefault(_is);

var _lo = require('utilise/lo');

var _lo2 = _interopRequireDefault(_lo);

/* istanbul ignore next */
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------
// Loads resources from the /resources folder
// -------------------------------------------
function resdir(ripple) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$dir = _ref.dir,
      dir = _ref$dir === undefined ? '.' : _ref$dir;

  log('creating');
  var argv = require('minimist')(process.argv.slice(2)),
      folders = (argv.r || argv.resdirs || '').split(',').concat(dir).filter(Boolean).map(function (d) {
    return (0, _path.resolve)(d);
  }).map((0, _append2.default)('/resources/**/!(test).{js,css}')),
      watcher = _chokidar2.default.watch(folders, { ignored: /\b_/ }).on('error', err).on('add', register(ripple)).on('change', register(ripple)).on('ready', function () {
    (0, _def2.default)(ripple, 'ready', true);
    (0, _values2.default)(ripple.resources).map(loaded(ripple));
    ripple.emit('ready');
    if ((0, _lo2.default)(process.env.NODE_ENV) == 'prod' || (0, _lo2.default)(process.env.NODE_ENV) == 'production') watcher.close();
  });

  return ripple;
}

var register = function register(ripple) {
  return function (path) {
    var last = (0, _path.basename)(path),
        isJS = (0, _path.extname)(path) == '.js',
        name = isJS ? last.replace('.js', '') : last,
        cach = delete require.cache[path],
        body = (isJS ? require : _file2.default)(path),
        css = isJS && (0, _fs.existsSync)(path.replace('.js', '.css')),
        res = _is2.default.obj(body = body.default || body) ? body : css ? { name: name, body: body, headers: { needs: '[css]' } } : { name: name, body: body };

    ripple(res);

    if (ripple.ready) loaded(ripple)(ripple.resources[res.name]);
  };
};

var log = require('utilise/log')('[ri/resdir]'),
    err = require('utilise/err')('[ri/resdir]'),
    loaded = function loaded(ripple) {
  return function (res) {
    return _is2.default.fn(res.headers.loaded) && res.headers.loaded(ripple, res);
  };
};