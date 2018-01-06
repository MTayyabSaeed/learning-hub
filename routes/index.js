var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var date = require('date-and-time');
var passport = require('passport');
var app = express();

// app.locals.username = "Dummy Username";
console.log(app.locals.username);

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('homepage/index', {title: 'Learning Hub' });
});


/* GET student profile page. */
router.get('/student', authenticationMiddleware(), function (req, res, next) {
    if (!res.locals.login_username) {
        var username = app.locals.username
    } else {
        username = res.locals.login_username;
    }
    // let username = app.locals.username;
///    console.log(res.locals.for_frontend_username);

    res.render('student/studentProfile', {for_frontend_username: username});

});

/* GET faqs page. */
router.get('/faqs', function (req, res, next) {
    res.render('faqs/faqsPage', {title: 'Learning Hub'});
});

/* GET sign up page....... this has been changed but kept for copying the code*/
router.get('/login', function (req, res, next) {
    res.render('user/login', {title: 'Learning Hub'});
});

/* GET sign up page....... this has been changed but kept for copying the code*/
router.get('/signup', function (req, res, next) {
    res.render('user/signup', {title: 'Learning Hub'});
});

router.get('/instructor', authenticationMiddleware(), function (req, res, next) {

    if (!res.locals.login_username) {
        var username = app.locals.username
    } else {
        username = res.locals.login_username;
    }
    res.render('instructor/instructorProfile', {for_frontend_username: username});
});
/*-----------------------SignIn Post Request-------------------------------------*/
// We will be using the passport authentication function instead of the call back function
// here the passport authticate will find the local stratgy in the app.js and will pass the
//form data to that where we will connect with data base and verify everything
/*------AuthenticationMiddleware() is used to restrict the page until the user is LogedIn---------*/

router.get('/after-login-page', authenticationMiddleware(), function (req, res, next) {
    res.render('after-login-page/after-login-page', {title: 'Learning Hub'});
});
/*-------------------------------------------------------------------------------------------------*/
router.post('/login', passport.authenticate('local', {
        failureRedirect: '/login'
    }), (req, res) => {
        var usertype = res.locals.usertype;

        if (usertype == 'Student') {
            res.redirect('student');
        }
        if (usertype == 'Instructor') {
            res.redirect('instructor');
        }
    }
);
/*------AuthenticationMiddleware() is used to restrict the page until the user is LogedIn---------*/
router.get('/after-login-page', authenticationMiddleware(), function (req, res, next) {
    res.render('after-login-page/after-login-page', {title: 'Learning Hub'});
});
/*-------------------------------------------------------------------------------------------------*/
router.get('/logout', function (req, res, next) {

    req.logOut();
    req.session.destroy();
    res.redirect('/');
});

/*------------------Singup Post Request---------------------------------------*/
router.post('/register', function (req, res, next) {
    req.checkBody('username', 'Username field cannot be empty.').notEmpty();
    req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 15);
    req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
    req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
    req.checkBody('password', 'Password must be between 8-100 characters long.').len(8, 100);
    req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
    // req.checkBody('passwordMatch', 'Password must be between 8-100 characters long.').len(8, 100);
    // req.checkBody('passwordMatch', 'Passwords do not match, please try again.').equals(req.body.password);

// Additional validation to ensure username is alphanumeric with underscores and dashes
    req.checkBody('username', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');
    var errors = req.validationErrors();
    if (errors) {
        res.render('user/signup', {errors: errors});
        return
    } else {
        const saltRounds = 10;
        const usertype = req.body.usertype;
        const email = req.body.email;
        const password = req.body.password;
        const username = req.body.username;
        const myPlaintextPassword = password;
        const db = require('../model/database-connection');
        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(myPlaintextPassword, salt, function (err, hash) {
                const bcyptPassword = hash;
                db.query('INSERT INTO users (username, email, password,usertype) VALUES (?,?,?,?)', [username, email, bcyptPassword, usertype], function (err, result, fields) {
                    if (err) throw err;
                    //setting locals
                    app.locals.username = username;

                    /*Signing in the user when the registration is successful*/

                    db.query('SELECT LAST_INSERT_ID() as id', function (err, results, fields) {
                        if (err) {
                            throw err;
                        }
                        /*---Lets assign the user_id-------*/
                        var user_id = results[0].id;
                        console.log(results[0]);
                        /*---Login is Passport function,it will take the user id and
                        store that directly into the session---*/
                        /*---The login function works with the serlyzing and deserilizing fucntion which
                        * is written below*/
                        /*----The login function is passing the user_id to the serlyzing function which writes
                        the session */

                        req.login(user_id, username, function (err) {
                            if (err) {
                                throw err;
                            }
                            if (usertype == 'Student') {
                                res.redirect('student');
                            }

                            if (usertype == 'Instructor') {

                                res.redirect('instructor');
                            }
                        })
                    })
                })
            })
        })
    }
});

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
        console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

        if (req.isAuthenticated()) return next();
        res.render('partials/nav-bar'); //todo  made changes here

    }
}

/*------------------------------------------------------------------------*/


module.exports = router;
