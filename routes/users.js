var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET sign up page....... this has been changed but kept for copying the code*/
router.get('/login', function(req, res, next) {
    res.render('user/login', { title: 'Learning Hub'});
});

/* GET sign up page....... this has been changed but kept for copying the code*/
router.get('/signup', function(req, res, next) {
    res.render('user/signup', { title: 'Learning Hub' });
});

/*Singup Post Request*/
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
        return}else{
        const usertype = req.body.usertype;
        const saltRounds = 10;
        const email = req.body.email;
        const password= req.body.password;
        const username = req.body.username;
        const myPlaintextPassword = password;
        const db = require('../model/database-connection');

        bcrypt.genSalt(saltRounds, function (err,salt) {
            bcrypt.hash(myPlaintextPassword,salt,function (err,hash) {
                const bcyptPassword = hash;
                db.query('INSERT INTO user (username, email, password,usertype) VALUES (?,?,?,?)', [username, email, bcyptPassword,usertype],function (err, result, fields) {
                    if(err)throw error;

                    res.render('after-login-page/after-login-page', { title: 'Registration Complete' , user: username});
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


// Get Question List


//Get Specific Question


//Add Comment

//Add Vote


module.exports = router;
