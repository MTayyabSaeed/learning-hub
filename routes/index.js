var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var date = require('date-and-time');
var passport = require('passport');
var app = express();
var util = require("util");
const db = require('../model/database-connection');
var user = require('../routes/users');
var inst = require('../routes/instructor');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('homepage/index', {title: 'Learning Hub'});
});


router.get('/catalogue', function (req, res, next) {

    message = '';
    var sql="SELECT * FROM `tbl_courses`";

    db.query(sql, function(err, results){

        //  console.log(results);
        if(results.length <= 0)
            message = "No records found!";
        res.render('allCourses/catalogue', {data:results,message: message,title: 'Courses'});
    });

});


/*------------------------------------------------------------Waqaace Part Start----------------------------------------------------------*/



/*------------------------------------------------------------Waqaace Part Start----------------------------------------------------------*/

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


});


router.get('/about', function (req, res, next) {
    res.render('aboutLearningHub/about', {title: 'Learning Hub'});

});



router.get('/viewAllCourse', function (req, res, next) {

    message = '';
    chapter_message = '';
    results = '';


    var user =  req.session.username,
        userId = req.session.userID;

    var sql1="SELECT * FROM `tbl_courses`";
    var course_title = '';
    var course_des = '';
    db.query(sql1, function(err, results){
        if(results.length <= 0)
            message = "No data found!";
        course_title = results[0].course_title;
        course_des = results[0].course_des;
    });

    var sql="SELECT * FROM `tbl_chapters`";
    db.query(sql, function(err, result){
        if(result.length <= 0)
            message = "No records found!";

        res.render('viewAllCourse.ejs', {id:userId,user:user,data:result,course_title:course_title,course_des:course_des,message: message,title: 'Courses'});
    });
});


/* GET student profile page. */
router.get('/student', authenticationMiddleware(), function (req, res, next) {
    var username = req.session.username ;
    var usertype = req.session.passport.user.usertype;
    if (usertype  === 'Student'){
        res.render('student/studentProfile', {for_frontend_username: username, usertype: usertype});
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
    inst.dashboard(req,res,next);
});


// *************************** Instructor Part

router.get('/courses',  function (req, res, next) {
    inst.courses(req,res,next);
});

router.post('/courses',  function (req, res, next) {
    inst.courses(req,res,next);
});


router.get('/viewCourse/:id',  function (req, res, next) {
    inst.viewCourse(req,res,next);
});

//call for create course
router.get('/create',  function (req, res, next) {
    inst.create(req,res,next);
});


//call for create course post
router.post('/create',  function (req, res, next) {
    inst.create(req,res,next);
});

//call for create course
router.get('/edit_course/:id',  function (req, res, next) {
    inst.edit_course(req,res,next);
});


//call for create course post
router.post('/edit_course/:id',  function (req, res, next) {
    inst.edit_course(req,res,next);
});



//call for create course
router.get('/edit_chapter/:id',  function (req, res, next) {
    inst.edit_chapter(req,res,next);
});

//call for create course post
router.post('/edit_chapter/:id',  function (req, res, next) {
    inst.edit_chapter(req,res,next);
});


router.post('/viewCourse/:id',  function (req, res, next) {
    inst.viewCourse(req,res,next);
});


//call for quiz page
router.get('/quiz',  function (req, res, next) {
    inst.quiz(req,res,next);
});


//call for quiz page
router.post('/quiz',  function (req, res, next) {
    inst.quiz(req,res,next);
});

//call for quiz page
router.get('/quizzes',  function (req, res, next) {
    inst.quizzes(req,res,next);
});


//call for quiz page
router.post('/quizzes',  function (req, res, next) {
    inst.quizzes(req,res,next);
});

//call for create course
router.get('/createQuiz',  function (req, res, next) {
    inst.createQuiz(req,res,next);
});

//call for create course post
router.post('/createQuiz',  function (req, res, next) {
    inst.createQuiz(req,res,next);
});


//call for courses page
router.get('/viewQuiz/:id',  function (req, res, next) {
    inst.viewQuiz(req,res,next);
});


router.post('/viewQuiz/:id',  function (req, res, next) {
    inst.viewQuiz(req,res,next);
});

router.get('/edit_quiz/:id',  function (req, res, next) {
    inst.edit_quiz(req,res,next);
});


router.post('/edit_quiz/:id',  function (req, res, next) {
    inst.edit_quiz(req,res,next);
});


router.get('/edit_question/:id',  function (req, res, next) {
    inst.edit_question(req,res,next);
});

router.post('/edit_question/:id',  function (req, res, next) {
    inst.edit_question(req,res,next);
});


router.post('/delete_question/:id',  function (req, res, next) {
    inst.delete_question(req,res,next);
});



router.post('/deleteChapters/:id',  function (req, res, next) {
    inst.deleteChapters(req,res,next);
});


router.get('/viewDetails/:id',  function (req, res, next) {
    inst.viewDetails(req,res,next);
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
