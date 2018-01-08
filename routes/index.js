var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var date = require('date-and-time');
var passport = require('passport');
var app = express();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('homepage/index', {title: 'Learning Hub'});
});
router.get('/forum', function (req, res, next) {
    res.render('sockets/sockets', {title: 'Learning Hub'});

});

router.get('/about', function (req, res, next) {
    res.render('aboutLearningHub/about', {title: 'Learning Hub'});

});

/* GET student profile page. */
router.get('/student', authenticationMiddleware(), function (req, res, next) {
    var username = req.session.username ;
    var usertype = req.session.passport.user.usertype;
    if (usertype  === 'Student'){
        res.render('student/studentProfile', {for_frontend_username: username});
    }if(usertype  === 'Instructor'){
        res.redirect('instructor');
    }
});

/* GET faqs page. */
router.get('/faqs', function (req, res, next) {
    res.render('faqs/faqsPage', {title: 'Learning Hub'});
});

/* GET sign up page....... this has been changed but kept for copying the code*/
router.get('/login', function (req, res, next) {

    if(req.isAuthenticated()){res.redirect('student')}else{

        var errors = req.flash('loginMessage');

        if(errors.length == 0) {
            var errors = '';
        }

        res.render('user/login', {errors: errors})}
// }
    // else{
    // res.redirect('student');
// }
});

/* GET sign up page....... this has been changed but kept for copying the code*/
router.get('/signup', function (req, res, next) {
    if(req.isAuthenticated()){res.redirect('student')}else{
        if(req.isAuthenticated()){res.redirect('instructor')}

        var errors = req.flash('signupMessage');
        if(errors.length == 0) {
            var errors = '';
        };

        var signupUser = req.flash('signupUser');
        if(signupUser.length == 0) {
            var signupUser = '';
        };
        res.render('user/signup', {signupErrors: errors, userTakenError: signupUser});
    }
});

/*------AuthenticationMiddleware() is used to restrict the page until the user is LogedIn---------*/
router.get('/instructor', authenticationMiddleware(), function (req, res, next) {
    var username = req.session.username ;
    var usertype = req.session.passport.user.usertype;
    if (usertype  === 'Student'){
        res.redirect('student');
    }if(usertype  === 'Instructor'){
        res.render('instructor/instructorProfile', {for_frontend_username: username});
    }
});
/*-----------------------SignIn Post Request-------------------------------------*/
// We will be using the passport authentication function instead of the call back function
// here the passport authticate will find the local stratgy in the app.js and will pass the
//form data to that where we will connect with data base and verify everything
router.post('/login', passport.authenticate('local-signin', {
        failureRedirect: '/login',
        failureFlash: true // allow flash messages

    }), (req, res) => {
        var usertype = res.locals.usertype;

        if (usertype === 'Student') {
            res.redirect('student');
        }
        if (usertype === 'Instructor') {
            res.redirect('instructor');
        }
    }
);
router.post('/register', passport.authenticate('local-signup', {
        failureRedirect: '/signup',
        failureFlash: true

    }), (req, res) => {
        //accessing the variables through sessions, so we can either access through the session or through the
        // locals as done in the /login
        var usertype = req.session.passport.user.usertype;
        if (usertype === 'Student') {
            res.redirect('student');
        }
        if (usertype === 'Instructor') {
            res.redirect('instructor');
        }
    }
);


/*-------------------------------------------------------------------------------------------------*/
router.get('/logout', function (req, res, next) {

    req.logOut();
    req.session.destroy();
    res.redirect('/');
});
/*------------------Singup Post Request---------------------------------------*/

/*----Serlyzing mean to set the session data while deserlyzing mean using the session data--*/
passport.serializeUser(function (user_id, done) {
    done(null, user_id);
});

passport.deserializeUser(function (user_id, done) {
    done(null, user_id);
});

/*--------Function to Restricting Page when user is not LogedIn-------------*/
function authenticationMiddleware() {
    return (req, res, next) => {

        if (req.isAuthenticated()) return next();

    }
}
/*------------------------------------------------------------------------*/

module.exports = router;
