var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('courses/index', { title: 'Learning Hub' });
});

/* GET faqs page. */
router.get('/faqs', function(req, res, next) {
    res.render('faqs/faqsPage', { title: 'Learning Hub' });
});


/* GET sign up page....... this has been changed but kept for copying the code*/
router.get('/login', function(req, res, next) {
  res.render('user/login', { title: 'Learning Hub'});
});

/* GET sign up page....... this has been changed but kept for copying the code*/
router.get('/signup', function(req, res, next) {
  res.render('user/signup', { title: 'Learning Hub' });
});



module.exports = router;
