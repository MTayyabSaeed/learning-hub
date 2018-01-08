var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var date = require('date-and-time');
var passport = require('passport');
var app = express();
var util = require("util");
const db = require('../model/database-connection');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('homepage/index', {title: 'Learning Hub'});
});
// router.get('/forum', function (req, res, next) {
//     res.render('sockets/sockets', {title: 'Learning Hub'});
//
// });

router.get('/forum', authenticationMiddleware(),  function (req, res, next) {

    db.query('SELECT * FROM questions', function (err, result, fields) {
        if (err)throw error;

        console.log("The result from query is " + result);

        // console.log("the user data is "+util.inspect(req.session.passport.user, false, null));

        console.log("the user data is " + util.inspect(req.session, false, null));

        res.render('forum/questionList', {title: 'Learning Hub', questionList: result, user: req.session.username});
    });

    console.log(req.user);

});

router.get('/forum/question', function (req, res, next) {

    const questionId = req.query.id;
    let question;
    let comments;

    console.log("The request body is:" + util.inspect(req.query, false, null));

    db.query('SELECT * FROM questions WHERE id = ?', [questionId], function (err, result, fields) {
        if (err)throw error;

        question = result;

        //  db.query('SELECT * FROM comments WHERE question_id = ?', [id], function (err, result, fields) {
        // if (err)throw error;

        //  db.query('SELECT user.name,comments.comment FROM user,comments WHERE comments.question_id = ?', [id],
        //    function (err, result, fields) {

        //  db.query('SELECT * FROM comments c join user u on c.user_id = u.id WHERE c.question_id = ?', [id],
        db.query('SELECT * FROM comments WHERE question_id = ?', [questionId],
            function (err, result, fields) {

                comments = result;

                res.render('forum/questionDetails', {title: 'Learning Hub', question: question, comments: comments});


                // db.query('SELECT * FROM comments WHERE question_id = ?', [id], function (err, result, fields) {
                //    // if (err)throw error;
                //
                //     comments = result;
                //
                //
                //     res.render('sockets/sockets', {title: 'Learning Hub', question: question, comments: result});
                //
            });
    });

});

router.post('/forum/addQuestion', function (req, res, next) {

    const question = req.body.question;
    const username = req.session.username;

    console.log("The request body is:" + util.inspect(req.body, false, null));

    db.query('INSERT INTO questions (user_id,question)  VALUES (?,?)', [username, question], function (err, result, fields) {
        if (err)throw error;

        db.query('SELECT * FROM questions', function (err, result, fields) {

            if (err)throw error;

            console.log("The result from query is " + result);

            // console.log("the user data is "+util.inspect(req.session.passport.user, false, null));

            console.log("the user data is " + util.inspect(req.session, false, null));

            res.render('forum/questionList', {title: 'Learning Hub', questionList: result, user: req.session.username});
        });
    });
});

router.post('/forum/addComment', function (req, res, next) {

    const questionId = req.body.id;
    const username = req.session.username;
    const comment = req.body.comment;

    console.log("The request body is:" + util.inspect(req.body, false, null));

    db.query('INSERT INTO comments (user_id,question_id,comment) VALUES (?,?,?)', [username, questionId, comment], function (err, result, fields) {
        if (err)throw error;

        // return res.redirect('http://localhost:3000/forum/question?id='+questionId);

        res.json('http://localhost:3000/forum/question?id=' + questionId);
        //  return ;

        // db.query('SELECT * FROM questions WHERE id = ?', [questionId], function (err, result, fields) {
        //     if (err)throw error;
        //
        //     question = result;
        //
        //     //  db.query('SELECT * FROM comments WHERE question_id = ?', [id], function (err, result, fields) {
        //     // if (err)throw error;
        //
        //     //  db.query('SELECT user.name,comments.comment FROM user,comments WHERE comments.question_id = ?', [id],
        //     //    function (err, result, fields) {
        //
        //     //  db.query('SELECT * FROM comments c join user u on c.user_id = u.id WHERE c.question_id = ?', [id],
        //     db.query('SELECT * FROM comments WHERE question_id = ?', [questionId],
        //         function (err, result, fields) {
        //
        //             comments = result;
        //
        //             res.render('forum/questionDetails', {title: 'Learning Hub', question: question, comments: comments});
        //
        //
        //             // db.query('SELECT * FROM comments WHERE question_id = ?', [id], function (err, result, fields) {
        //             //    // if (err)throw error;
        //             //
        //             //     comments = result;
        //             //
        //             //
        //             //     res.render('sockets/sockets', {title: 'Learning Hub', question: question, comments: result});
        //             //
        //         });
        // });
        // db.query('SELECT * FROM questions', function (err, result, fields) {
        //
        //     if (err)throw error;
        //
        //     console.log("The result from query is " + result);
        //
        //     // console.log("the user data is "+util.inspect(req.session.passport.user, false, null));
        //
        //     console.log("the user data is " + util.inspect(req.session, false, null));
        //
        //     res.render('forum/questionList', {title: 'Learning Hub', questionList: result, user: req.session.username});
        //
        //
        // });
    });
});

router.post('/forum/comment/upvote', function (req, res, next) {

    const username = req.session.username;
    const commentID = req.body.commentid;

    console.log("The request body is:" + util.inspect(req.body, false, null));

    // check to see if the user has already voted
    db.query('SELECT * FROM votes WHERE user_id = ? AND comment_id = ?', [username, commentID], function (err, result, fields) {
        if (err)throw error;

        console.log("Votes Selected");

        if (result.length == 0) {
            // Insert verirication that user has voted on a specific comment
            db.query('INSERT INTO votes (user_id,comment_id) VALUES (?,?)', [username,commentID], function (err, result, fields) {
                if (err)throw error;

            });
            // increment votes on the comment
            db.query('UPDATE comments SET votes = votes + 1 WHERE id = ?', [commentID], function (err, result, fields) {
                if (err)throw error;

            });

            res.json({"status":"Successful"});

            console.log("The result from upvoting is " + result.length);
        }else {


            res.json({"status":"Already Voted"});
        }

    });

    // db.query('SELECT votes FROM comments WHERE id = ?',[commentID] ,function (err, result, fields) {
    //     if (err)throw error;
    //
    //     console.log("The result from upvoting is " + util.inspect(result, false, null) );
    //
    //
    // });
    //
    // db.query('INSERT INTO comments (user_id,question_id,comment) VALUES (?,?,?)',[username,questionId,comment], function (err, result, fields) {
    //     if (err)throw error;
    //
    // });

    //add upvote   //userID from passport   // qusttion from post

})

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
