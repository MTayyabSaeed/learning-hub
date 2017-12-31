var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var date = require('date-and-time');
var passport = require('passport');





/* GET home page. */
router.get('/', function(req, res, next) {
    var now = new Date();
    console.log( date.format(new Date(), 'DD-MM-YYYY'));

    res.render('homepage/index', { title: 'Learning Hub' });
});

/* GET instructor profile course page. */
router.get('/instructor/instructor-profile', function(req, res, next) {
    res.render('instructor/instructor-profile', { title: 'Learning Hub' });
});






router.get('/Forum', function(req, res, next) {
    res.render('sockets/sockets', { title: 'Learning Hub' });


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





/*------AuthenticationMiddleware() is used to restrict the page until the user is LogedIn---------*/
router.get('/after-login-page',authenticationMiddleware(), function(req, res, next) {
    res.render('after-login-page/after-login-page', { title: 'Learning Hub' });
});
/*-------------------------------------------------------------------------------------------------*/

/*-----------------------SignIn Post Request-------------------------------------*/



// We will be using the passport authentication function instead of the call back function
// here the passport authticate will find the local stratgy in the app.js and will pass the
//form data to that where we will connect with data base and verify everything

router.post('/login', passport.authenticate('local',{
    successRedirect: '/after-login-page',
    failureRedirect: '/login'}));


/*------------------------------------------------------------------------------*/


router.get('/logout', function(req, res, next) {

    req.logOut();
    req.session.destroy();
    res.redirect('/');
});

/*------------------Singup Post Request---------------------------------------*/

router.post('/register', function(req, res, next) {
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

    if(errors){
        res.render('homepage/index',{errors:errors});
        return }else{

        const saltRounds = 10;
        const email = req.body.email;
        const password= req.body.password;
        const username = req.body.username;
        const myPlaintextPassword = password;
        const db = require('../model/database-connection');


        bcrypt.genSalt(saltRounds, function (err,salt) {
            bcrypt.hash(myPlaintextPassword,salt,function (err,hash) {
                const bcyptPassword = hash;
                db.query('INSERT INTO user (username, email, password) VALUES (?,?,?)', [username, email, bcyptPassword],function (err, result, fields) {
                    if(err)throw error;


                    /*Signing in the user when the registration is successful*/

                    db.query('SELECT LAST_INSERT_ID() as id',function (err,results,fields) {
                        if(err){throw err;}

                        /*---Lets assign the user_id-------*/
                        var user_id = results[0].id;


                        /*---Login is Passport function,it will take the user id and
                        store that directly into the session---*/
                        /*---The login function works with the serlyzing and deserilizing fucntion which
                        * is written below*/
                        /*----The login function is passing the user_id to the serlyzing function which writes
                        the session */
                        req.login(user_id,username,function (err) {
                            if (err){throw err;}
                            res.redirect('/');
                        })
                    })
                })
            })
        })

        /*var sql = 'INSERT INTO user (username,email,password) VALUES (req.body.username,req.body.email,req.body.password)';
        db.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });*/


    }

});

/*----Serlyzing mean to set the session data while deserlyzing mean using the session data--*/
passport.serializeUser(function(user_id, done) {
    done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {

    done(null, user_id);

});


/*--------Function to Restricting Page when user is not LogedIn-------------*/
function authenticationMiddleware () {
    return (req, res, next) => {
        console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

        if (req.isAuthenticated()) return next();
        res.render('/after-login-page')
    }
}
/*------------------------------------------------------------------------*/




module.exports = router;
