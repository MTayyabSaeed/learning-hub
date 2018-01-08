var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var expressValidator = require('express-validator');
var index = require('./routes/index');
var users = require('./routes/users');
var flash = require('connect-flash');
/*------------Authentication Packages----------------*/
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
//express-mysql-session is used to store the session in the db just in case we restart the server we
//the user will not log out.The below code is use to store session in the data base.

var MySQLStore = require('express-mysql-session')(session);


var options = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Learning hub'
};

var sessionStore = new MySQLStore(options);
//Now we will pass this variable in the session below the page in app.use(session...)

/*--------------------------------------------------*/


var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


/*---Use the this command for the validator-----*/
app.use(expressValidator());
/*-------------------------------------------------*/

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/*------------------------Sessions/Passport--------------------*/

/*const key = randomString.generate({
    length: 12,
    charset: 'alphabetic'

});
console.log(key);*/

app.use(session({
    secret: 'ViAxwhpbhmYm',
    resave: false, //On each refresh the session will update or not
    store: sessionStore,
    saveUninitialized: false //whether or not crete session on each start of website or when only user is loign
    //cookie: {secure: true}

}));

/*---------------------Passport-----------------------*/
app.use(passport.initialize());
app.use(passport.session());
/*----------------------------------------------------*/

/*--Creating the Global Variable that we can use at the hbs for disapearing login button when logedin----*/
/*This is the general middle ware*/
app.use(function (req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.login_username = app.locals.username;
    res.locals.usertype = app.locals.usertype;
    //console.log(res.locals.usertype);
    next();
});

/*-----------------------------------------------------------------------------------*/
app.use(flash());
app.use('/', index);
app.use('/users', users);


/*----The local strategy is defined here which will verify the username and password----*/


passport.use('local-signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, username, password, done) {
        req.checkBody('username', 'Username field cannot be empty.').notEmpty();
        req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 15);
        req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
        req.checkBody('email', 'Email address must be between 4-100 characters long.').len(4, 100);
        req.checkBody('password', 'Password must be between 8-100 characters long.').len(8, 100);
        req.checkBody("password", "Password must include one lowercase character").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
        req.checkBody("password", "One uppercase character, a number, a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
        // req.checkBody('passwordMatch', 'Password must be between 8-100 characters long.').len(8, 100);
        // req.checkBody('passwordMatch', 'Passwords do not match, please try again.').equals(req.body.password);
// Additional validation to ensure username is alphanumeric with underscores and dashes
        req.checkBody('username', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');
        var errors = req.validationErrors();
        if (errors) {
            return done(null, false, req.flash('signupMessage', errors));
        };
        const saltRounds = 10;
        const usertype = req.body.usertype;
        const email = req.body.email;
        const myPlaintextPassword = password;
        const db = require('./model/database-connection');
        console.log(usertype);
        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(myPlaintextPassword, salt, function (err, hash) {
                const bcyptPassword = hash;
                db.query('SELECT username FROM user WHERE username = ?', [username], function (err, result) {
                    if (err) {
                        throw err;}
                    if (result.length) {
                        return done(null, false, req.flash('signupUser', 'That username is already taken.'));
                    } else {
                        db.query('INSERT INTO user (username, email, password,usertype) VALUES (?,?,?,?)', [username, email, bcyptPassword, usertype], function (err, result, fields) {
                            if (err) throw err;
                            req.session.username = username;
                            app.locals.username = username;
                            /*Signing in the user when the registration is successful*/
                            db.query('SELECT LAST_INSERT_ID() as id', function (err, results, fields) {
                                if (err) {
                                    throw err;}
                                /*---Lets assign the user_id-------*/
                                var user_id = results[0].id;
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

                                        return done(null, {usertype: 'Student'});
                                    }
                                    if (usertype == 'Instructor') {

                                        //to access the usertype we will use the passport session as]
                                        //req.session.passport.user.usertype
                                        //Acccesing the variables through sessions
                                        return done(null, {usertype: 'Instructor'});
                                    }
                                })
                            })

                        })


                    }


                });

            })
        })


    }));


passport.use('local-signin', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function (req, username, password, done) {
        //we are getting username and password from the form
        const db = require('./model/database-connection');
        db.query('SELECT usertype,password,id FROM user WHERE username = ?', [username], function (err, result, fields) {
            if (err) {

                throw  err
            }
            if (!result.length) {

                return done(null, false, req.flash('loginMessage', 'No user found.'));
            }

            //iF THE PASSWORD DOES MATCH found or USER DOES NOT EXIST THEN WE ASSIGN RESULT.LENGTH===0
            //Here the result index 0 has password which is not proper form so we access the
            //value of the key password in the array of result the convert that into the String
            const hash = result[0].password.toString();
            const userID = result[0].id.toString();
            const usertype = result[0].usertype.toString();
            //assigining locals, with app.locals the variable have scope to this file. only so we hhave
            //defined them abovein the middle ware and make it availble globbaly.
            req.session.username = username;
            app.locals.usertype = usertype;
            app.locals.username = username;

            //variable decaled with app.locals have scope only to this file. when locals declared with res.locals.
            // have scope to the whole project.
            //Here the bcrypt.compare , compare the password with the hash password, hash password is the password
            //we are getting from the data base, the 'password' field below is the password which user enters.
            //we dont need the salt this time becs the bcrypt.compare does that automatically for us.

            bcrypt.compare(password, hash, function (err, response) {
                console.log("My position is at 1");
                if (response === true) {
                    console.log("My position is at 3");
                    return done(null, {usertype: usertype});
                } else {
                    console.log("My position is at 4");
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                }
            })
        })
    }));
/*-------------------------------------------------------------------------------------*/
// view engine setup

app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

require('./model/database-connection');

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


/*=======================Sockets Part=============================*/
var sockIO = require('socket.io')();
app.sockIO = sockIO;
sockIO.on('connection', function (socket) {
    console.log('A user connected!');

    socket.on('chat message', function (msg) {
        sockIO.emit('chat message', msg);
        console.log(msg);
    });

    socket.on('update_Vote', function (msg) {
        sockIO.emit('update_Vote', msg);
        console.log("the updated vote"+ msg);
    });
});
/*=======================Sockets End=============================*/


module.exports = app;
