var express = require('express');
var tes = require('../model/signupuser.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('homepage/index', { title: 'Learning Hub' });
});

/* GET instructor profile course page. */
router.get('/instructor/instructor-profile', function(req, res, next) {
    res.render('instructor/instructor-profile', { title: 'Learning Hub' });
});

/* GET a make course page. */
router.get('/instructor/make-course', function(req, res, next) {
    res.render('instructor/make-course', { title: 'Learning Hub' });
});

/* GET student profile page. */
router.get('/student/student-profile', function(req, res, next) {
    res.render('student/student-profile', { title: 'Learning Hub' });
});

/* GET inside a course page that a student has registered. */
router.get('/student/registered-course', function(req, res, next) {
    res.render('student/registered-course', { title: 'Learning Hub' });
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

/* GET sign up page....... this has been changed but kept for copying the code*/
router.get('/test', function(req, res, next) {
    res.render('homepage/index', { title: 'Learning Hub' });
});

router.post('/signupuser', function(req, res, next) {
    tes.get_recent(req,res)
});



module.exports = router;
