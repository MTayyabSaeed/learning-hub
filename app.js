var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs=require('express-handlebars');
var expressValidator = require('express-validator');
var index = require('./routes/index');
var users = require('./routes/users');

/*------------Authentication Packages----------------*/
var session = require('express-session');
var passport = require('passport');
var LocalStrategy  =  LocalStrategy = require('passport-local').Strategy;
var bcrypt= require('bcrypt');
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
app.use(bodyParser.urlencoded({ extended: false }));



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

}))


/*---------------------Passport-----------------------*/

app.use(passport.initialize());
app.use(passport.session());



/*----------------------------------------------------*/

/*--Creating the Global Variable that we can use at the hbs for disapearing login button when logedin----*/

app.use(function (req,res,next) {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
})

/*-----------------------------------------------------------------------------------*/

app.use('/', index);
app.use('/users', users);



/*----The local strategy is defined here which will verify the username and password----*/


passport.use(new LocalStrategy(
    function(username, password, done) {
    //we are getting username and password from the form
    const db = require('./model/database-connection');
        console.log(username);
        console.log(password);

        db.query('SELECT password FROM user WHERE username = ?',[username],function (err,result,fields){
            if (err){done (err)}
            //iF THE PASSWORD DOES MATCH found or USER DOES NOT EXIST THEN WE ASSIGN RESULT.LENGTH===0
            if(result.length === 0){
                done(null,false); }

                //Here the result index 0 has password which is not proper form so we access the
                //value of the key password in the array of result the convert that into the String
            const hash = result[0].password.toString();
            console.log(result[0].password.toString());

            //Here the bcrypt.compare , compare the password with the hash password, hash password is the password
            //we are getting from the data base, the 'password' field below is the password which user enters.
            //we dont need the salt this time becs the bcrypt.compare does that automatically for us.

                bcrypt.compare(password,hash,function (err,response) {
                    if(response === true){

                        return done(null, {user_id:34});
                    }else {
                        return done(null,false);
                    }
                })


        })

            return done(null, 'asdfdfa');

    }
));

/*-------------------------------------------------------------------------------------*/








// view engine setup
app.engine('.hbs',expressHbs({defaultLayout: 'layout',extname:'.hbs'}));
app.set('view engine', '.hbs');

require('./model/database-connection');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});









module.exports = app;
