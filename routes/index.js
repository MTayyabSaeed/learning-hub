var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('courses/index', { title: 'Learning Hub' });
});

/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('user/login', { title: 'Learning Hub'});
});

/* GET home page. */
router.get('/signup', function(req, res, next) {
  res.render('user/signup', { title: 'Learning Hub' });
});

module.exports = router;
