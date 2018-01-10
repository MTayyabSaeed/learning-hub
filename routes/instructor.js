
const db = require('../model/database-connection');
var title ='';

exports.courses = function(req, res, next){
    message = '';
    var user =  req.session.username,
        userId = req.session.userID;

    if(userId == null){
        res.redirect("/");
        return;
    }
    if(req.method == "POST"){
        var post  = req.body;
        var course_id =post.course_id;
        var deletesql="DELETE FROM `tbl_courses` where course_id='"+course_id+"'";
        db.query(deletesql, function(err, result){

            if (err) {
                throw err;
            }
            else{
                console.log("Succesfully!  course deleted: ");
            }
        });
    }

    var sql="SELECT * FROM `tbl_courses` INNER JOIN users ON users.id=tbl_courses.user_id where tbl_courses.user_id='"+userId+"'";

    db.query(sql, function(err, results){

        //  console.log(results);
        if(results.length <= 0)
            message = "No records found!";
        // console.log(results);
        res.render('courses.ejs', {id:userId,user:user,data:results,message: message,title: 'Courses',fullname: user});

    });
};

exports.create = function(req, res, next){
    message = '';

    var user =  req.session.username,
        userId = req.session.userID;




    if(userId == null){

        console.log("Adasgfgsdjaghf "+ userId);

        res.redirect("/");
        return;
    }

    var date = new Date()
    console.log(date);
    if(req.method == "POST"){
        var post  = req.body;
        var course_title= post.course_title;
        var course_des= post.course_des;

        var sql = "INSERT INTO `tbl_courses`(`course_title`,`course_des`,`user_id`,`course_created`) VALUES ('" + course_title + "','" + course_des + "','" + userId + "','"+date+"')";
        console.log(sql);
        db.query(sql, function(err, result) {
            if(result){

                message = "Succesfully! Your course has been created.";
                res.render('create_course.ejs',{message: message, title: 'Create Courses', fullname:user});
            }
            else{
                console.log(err);
            }


        });

    } else {
        res.render('create_course',{title: 'Create Courses', fullname:user});
    }
};

exports.edit_course = function(req, res, next){
    message = '';

    var user =  req.session.username,
        userId = req.session.userID;

    if(userId == null){
        res.redirect("/");
        return;
    }

    var message = '';
    var id = req.params.id;
    if(req.method == "POST"){
        var post  = req.body;
        var course_title= post.course_title;
        var course_des= post.course_des;

        var sqlupdate = "UPDATE `tbl_courses` set course_title='" + course_title + "',course_des = '" + course_des + "' where course_id='" + id + "'";

        var query = db.query(sqlupdate, function(err, result) {
            if(result){
                message = "Succesfully! Your course has been updated.";
                console.log(sqlupdate);
            }
            else{
                console.log(err);
            }
        });
    }

    var sql2="SELECT * FROM `tbl_courses` WHERE `course_id`='"+id+"'";
    db.query(sql2, function(err, result){
        if(result.length <= 0)
            res.redirect("/courses");
        //console.log( "Course" +result);
        res.render('edit_course.ejs',{data:result,message: message,title: 'Courses'});
    });
};



exports.viewCourse = function(req, res, next){
    message = '';
    chapter_message = '';
    results = '';
    var user =  req.session.username,
        userId = req.session.userID;

    if(userId == null){
        res.redirect("/");
        return;
    }

    var id = req.params.id;
    var date = new Date()
    console.log(date);
    var post  = req.body;

    var cname ='';
    cname = post.chapter_name;
    if((req.method == "POST" && req.body.chapter_name)){
        console.log(post.chapter_name);
        var post  = req.body;
        var chapter_name= post.chapter_name;
        var chapter_sub= post.chapter_sub;
        var chapter_link= post.chapter_link;
        var chapter_des= post.chapter_des;

        var sql = "INSERT INTO `tbl_chapters`(`chapter_title`,`chapter_sub`,`chapter_link`,`chapter_des`,`course_id`,`chapter_created`) VALUES ('" + chapter_name + "','" + chapter_sub + "','" + chapter_link + "','" + chapter_des + "','" + id + "','"+date+"')";

        var query = db.query(sql, function(err, result) {
            if(result){
                chapter_message = "Succesfully! Your chapter has been created.";
            }
            else{
                console.log(err);
            }
            //  res.render('create_course.ejs',{message: message});
        });

    }

    var sql1="SELECT * FROM `tbl_courses` where course_id='"+id+"'";
    var course_title = '';
    var course_des = '';
    db.query(sql1, function(err, results){
        if(results.length <= 0)
            message = "No data found!";
        course_title = results[0].course_title;
        course_des = results[0].course_des;
    });
    var sql="SELECT * FROM `tbl_chapters` where tbl_chapters.course_id='"+id+"'";
    db.query(sql, function(err, result){
        if(result.length <= 0)
            message = "No records found!";

        res.render('view_course.ejs', {id:userId,user:user,data:result,course_title:course_title,course_des:course_des,message: message,title: 'Courses'});
        console.log(course_title);
    });
};




exports.edit_chapter = function(req, res, next){
    message = '';

    var user =  req.session.username,
        userId = req.session.userID;

    if(userId == null){
        res.redirect("/");
        return;
    }

    var message = '';
    var id = req.params.id;
    if(req.method == "POST"){
        var post  = req.body;
        var chapter_title= post.chapter_title;
        var chapter_sub= post.chapter_sub;
        var chapter_link= post.chapter_link;
        var chapter_des= post.chapter_des;

        var sqlupdate = "UPDATE `tbl_chapters` set chapter_title='" + chapter_title + "',chapter_sub='" + chapter_sub + "',chapter_link='" + chapter_link + "',chapter_des = '" + chapter_des + "' where chapter_id='" + id + "'";

        var query = db.query(sqlupdate, function(err, result) {
            if(result){

                message = "Succesfully! Your chapter has been updated.";
            }
            else{
                console.log(err);
            }
            //console.log(sqlupdate);
        });
    }

    var sql2="SELECT * FROM `tbl_chapters` WHERE `chapter_id`='"+id+"'";
    db.query(sql2, function(err, result){
        if(result.length <= 0)
            res.redirect("/courses");
        //console.log( "Course" +result);
        res.render('edit_chapter.ejs',{data:result,message: message,title: 'Courses'});
    });


};

exports.quiz = function(req, res, next){
    message = '';
    quiz_message = ''
    var user =  req.session.username,
        userId = req.session.userID;

    if(userId == null){
        res.redirect("/");
        return;
    }
    if((req.method == "POST" && req.body.que)){
        var post  = req.body;
        var que= post.que;
        var ans1= post.ans_1;
        var ans2= post.ans_2;
        var ans3= post.ans_3;
        var ans4= post.ans_4;
        var correct_ans= post.correct_ans;
        // var course_id= post.course_id;

        var sql1 = "INSERT INTO `tbl_quiz`(`que`,`ans_1`,`ans_2`,`ans_3`,`ans_4`,`correct_ans`) VALUES ('" + que + "','" + ans1 + "','" + ans2 + "','"+ans3+"','"+ans4+"','"+correct_ans+"')";

        var query = db.query(sql1, function(err, result) {
            console.log( "sql" +sql1);
            if (err){s
                throw err;
            }
            else {
                quiz_message = "Succesfully! Your quiz has been created.";
            }
            //  res.render('create_course.ejs',{message: message});
        });

    }
    var sql="SELECT * FROM `tbl_quiz`";

    db.query(sql, function(err, results){

        //  console.log(results);
        if(results.length <= 0)
            message = "No records found!";
        console.log(results);
        res.render('quiz.ejs', {id:userId,user:user,data:results, message: message,title: 'Quiz',fullname: user});

    });
};

/****************************************************** delete quiz ******************/

exports.delete_question = function(req, res, next){
    message = '';
    quiz_message = ''
    var user =  req.session.username,
        userId = req.session.userID;

    if(userId == null){
        res.redirect("/");
        return;
    }

    if(req.method == "POST"){
        var post  = req.body;
        console.log("dsaas" + post.quiz_id)
        var quiz_id =post.quiz_id;
        var deletesql="DELETE FROM `tbl_quiz` where quiz_id='"+quiz_id+"'";
        db.query(deletesql, function(err, result){

            if (err) {
                throw err;
            }
            else{
                console.log("Succesfully!  quiz deleted: ");
            }
        });
    }

    var sql="SELECT * FROM `tbl_quiz`";

    db.query(sql, function(err, results){

        //  console.log(results);
        if(results.length <= 0)
            message = "No records found!";

        res.render('quiz.ejs', {id:userId,user:user,data:results, message: message,title: 'Quiz',fullname: user});

    });
};









/**********************************************************quizzes*****************************************************/
exports.quizzes = function(req, res, next){
    message = '';
    var user =  req.session.username,
        userId = req.session.userID;

    if(userId == null){
        res.redirect("/");
        return;
    }
    if(req.method == "POST"){
        var post  = req.body;
        var quiz_id =post.quiz_id;
        var deletesql="DELETE FROM `tbl_quizzes` where quiz_id='"+quiz_id+"'";
        db.query(deletesql, function(err, result){

            if (err) {
                throw err;
            }
            else {
                console.log("Succesfully!  tbl_quizzes deleted: ");
            }
        });
    }

    var sql="SELECT * FROM `tbl_quizzes` INNER JOIN users ON users.id=tbl_quizzes.user_id where tbl_quizzes.user_id='"+userId+"'";

    db.query(sql, function(err, results){

        if(err){
            throw  err;
        }
        else {
            res.render('quizzes.ejs', {
                id: userId,
                user: user,
                data: results,
                message: message,
                title: 'Quizzes',
                fullname: user
            });
        }
    });
};



exports.createQuiz = function(req, res, next){
    message = '';

    var user =  req.session.username,
        userId = req.session.userID;

    if(userId == null){
        res.redirect("/");
        return;
    }

    var date = new Date()

    if(req.method == "POST"){
        var post  = req.body;
        var quiz_title= post.quiz_title;
        var quiz_des= post.quiz_des;

        var sql = "INSERT INTO `tbl_quizzes`(`quiz_title`,`quiz_des`,`user_id`,`created`) VALUES ('" + quiz_title + "','" + quiz_des + "','" + userId + "','"+date+"')";

        var query = db.query(sql, function(err, result) {
            if (err){
                throw err;
            }
            else{
                message = "Succesfully! Your quiz has been created tbl_quizzes.";
                res.render('create_quiz.ejs',{message: message,title: 'Create Quiz',fullname:user});
            }

        });

    } else {
        res.render('create_quiz',{title: 'Create Quiz',fullname:user});
    }
};



exports.viewQuiz = function(req, res, next){
    message = '';
    question_message = '';
    results = '';
    var user =  req.session.username,
        userId = req.session.userID;

    if(userId == null){
        res.redirect("/");
        return;
    }

    var id = req.params.id;
    var date = new Date()
    //console.log(date);
    var post  = req.body;
    if((post.question_id !='')){

        var question_id =post.question_id;
        var deletesql="DELETE FROM `tbl_questions` where question_id='"+question_id+"'";
        db.query(deletesql, function(err, result){

            if (err)
                throw err;
            console.log("Succesfully!  tbl_questions deleted: ");

        });
    }
    var cquestion ='';
    cquestion = post.question;
    if((req.method == "POST" && req.body.question)){
        //console.log(post.question);
        var post  = req.body;
        var question= post.question;
        var option1= post.option1;
        var option2= post.option2;
        var option3= post.option3;
        var option4= post.option4;
        var answer= post.answer;

        var sql = "INSERT INTO `tbl_questions`(`question`,`option1`,`option2`,`option3`,`option4`,`answer`,`quiz_id`,`created`) VALUES ('" + question + "','" + option1 + "','" + option2 + "','" + option3 + "','" + option4 + "','" + answer + "','" + id + "','"+date+"')";
        console.log(sql);
        var query = db.query(sql, function(err, result) {
            console.log(sql);
            if (err){
                throw err;
            }
            else{
                question_message = "Succesfully! Your question has been created.";
            }
            //  res.render('create_course.ejs',{message: message});
        });
    }

    var sql1="SELECT * FROM `tbl_quizzes` where quiz_id='"+id+"'";
    var quiz_title = '';
    var quiz_des = '';
    db.query(sql1, function(err, results){

        message = "No data found!";
        quiz_title = results[0].quiz_title;
        quiz_des = results[0].quiz_des;
    });

    var sql="SELECT * FROM `tbl_questions` where tbl_questions.quiz_id='"+id+"'";
    db.query(sql, function(err, result){

        message = "No records found!";

        res.render('view_question.ejs', {id:userId,user:user,data:result,quiz_title:quiz_title,quiz_des:quiz_des,message: message,title: 'Quizzes'});
        console.log(quiz_title);

    });
};


exports.edit_quiz = function(req, res, next){
    message = '';

    var user =  req.session.username,
        userId = req.session.userID;

    if(userId == null){
        res.redirect("/");
        return;
    }

    var message = '';
    var id = req.params.id;
    if(req.method == "POST"){
        var post  = req.body;
        var quiz_title= post.quiz_title;
        var quiz_des= post.quiz_des;

        var sqlupdate = "UPDATE `tbl_quizzes` set quiz_title='" + quiz_title + "',quiz_des = '" + quiz_des + "' where quiz_id='" + id + "'";

        var query = db.query(sqlupdate, function(err, result) {

            if (err){
                throw err;
            }
            else{
                message = "Succesfully! Your quiz has been updated.";}
            //console.log(sqlupdate);
        });
    }

    var sql2="SELECT * FROM `tbl_quizzes` WHERE `quiz_id`='"+id+"'";
    db.query(sql2, function(err, result){
        if(result.length <= 0)
            res.redirect("/quizzes");
        //console.log( "Course" +result);
        res.render('edit_quiz.ejs',{data:result,message: message,title: 'Quizzes'});
    });


};


exports.edit_question = function(req, res, next){
    message = '';

    var user =  req.session.username,
        userId = req.session.userID;

    if(userId == null){
        res.redirect("/");
        return;
    }

    var message = '';
    var id = req.params.id;
    if(req.method == "POST"){
        var post  = req.body;
        var question= post.question;
        var option1= post.option1;
        var option2= post.option2;
        var option3= post.option3;
        var option4= post.option4;
        var answer= post.answer;

        var sqlupdate = "UPDATE `tbl_questions` set question='" + question + "',option1='" + option1 + "',option2='" + option2 + "',option3 = '" + option3 + "',option4 = '" + option4 + "',answer = '" + answer + "' where question_id='" + id + "'";

        var query = db.query(sqlupdate, function(err, result) {

            if (err){
                throw err;
            }
            else{
                message = "Succesfully! Your question has been updated.";}
            //console.log(sqlupdate);
        });
    }

    var sql2="SELECT * FROM `tbl_questions` WHERE `question_id`='"+id+"'";
    db.query(sql2, function(err, result){
        if(result.length <= 0)
            res.redirect("/quizzes");
        //console.log( "Course" +result);
        res.render('edit_question.ejs',{data:result,message: message,title: 'Quizzes'});
    });


};

/**********************************************************end quizzes*****************************************************/
// student panel
exports.home = function(req, res, next){

    message = '';

    console.log(req.session.username);

    var user =  req.session.username,
        userId = req.session.id;

    console.log(userId);

    if(userId == null){
        res.redirect("/");
        return;
    }

    console.log("Tasdhgjfhjgsdfhjghjsdkaf12312312");

    var sql="SELECT * FROM `tbl_courses` INNER JOIN users ON users.id=tbl_courses.user_id";
    console.log(sql);
    db.query(sql, function(err, results){

        console.log(results);
        if(results.length <= 0){
            message = "No records found!";
        }

        else {

            res.render('home_student.ejs', {
                id: userId,
                user: user,
                data: results,
                message: message,
                title: 'Courses',
            });
        }
    });
};



exports.viewDetails = function(req, res, next){
    message = '';
    course_title='';
    chapter_message = '';
    results = '';
    var user =  req.session.username,
        userId = req.session.userID;

    if(userId == null){
        res.redirect("/");
        return;
    }

    var id = req.params.id;
    var date = new Date()
    console.log(date);
    var post  = req.body;
    if((post.chapter_id !='')){

        var chapter_id =post.chapter_id;
        var deletesql="DELETE FROM `tbl_chapters` where chapter_id='"+chapter_id+"'";
        db.query(deletesql, function(err, result){
            if (err) {throw err;}
            else {
                console.log("Succesfully!  chapter deleted: ");
            }

        });
    }
    var cname ='';
    cname = post.chapter_name;
    if((req.method == "POST" && req.body.chapter_name)){
        console.log(post.chapter_name);
        var post  = req.body;
        var chapter_name= post.chapter_name;
        var chapter_sub= post.chapter_sub;
        var chapter_link= post.chapter_link;
        var chapter_des= post.chapter_des;

        var sql = "INSERT INTO `tbl_chapters`(`chapter_title`,`chapter_sub`,`chapter_link`,`chapter_des`,`course_id`,`chapter_created`) VALUES ('" + chapter_name + "','" + chapter_sub + "','" + chapter_link + "','" + chapter_des + "','" + id + "','"+date+"')";

        var query = db.query(sql, function(err, result) {
            if (err){
                throw err;
            }
            else{
                chapter_message = "Succesfully! Your chapter has been created.";}
            //  res.render('create_course.ejs',{message: message});
        });

    }

    var sql1="SELECT * FROM `tbl_courses` where course_id='"+id+"'";
    // course_title = '';
    //  course_des = '';


    var sql_quiz="SELECT * FROM `tbl_questions` where quiz_id='1'";


    var sql="SELECT * FROM `tbl_chapters` where tbl_chapters.course_id='"+id+"'";
    db.query(sql, function(err, result){
        if(result.length <= 0)
            message = "No records found!";

        db.query(sql1, function(err, results){
            if(results.length <= 0)
                message = "No data found!";
            //course_title = results[0].course_title;
            //course_des = results[0].course_des;


            db.query(sql_quiz, function (err, rows1, fields) {
                if (err) {
                    throw err;
                }
                else
                {
                    console.log("count row: "+rows1.length);
                }
                res.render('view_course_student.ejs', {id:userId,user:user,data:result,rows1:rows1,results:results,message: message,title: 'Courses'});

            });
        });
        //console.log(rows);
    });
};


exports.deleteChapters = function(req, res, next){
    message = '';
    course_title='';
    chapter_message = '';
    results = '';
    var user =  req.session.username,
        userId = req.session.userID;

    if(userId == null){
        res.redirect("/");
        return;
    }

    var id = req.params.id;
    var date = new Date()
    console.log(date);
    var post  = req.body;
    if((post.chapter_id !='')){

        var chapter_id =post.chapter_id;
        var deletesql="DELETE FROM `tbl_chapters` where chapter_id='"+chapter_id+"'";
        db.query(deletesql, function(err, result){
            if (err) {throw err;}
            else {
                console.log("Succesfully!  chapter deleted: ");
            }

        });
    }




    var sql1="SELECT * FROM `tbl_courses` where course_id='"+id+"'";
    // course_title = '';
    //  course_des = '';


    var sql_quiz="SELECT * FROM `tbl_questions` where quiz_id='1'";


    var sql="SELECT * FROM `tbl_chapters` where tbl_chapters.course_id='"+id+"'";
    db.query(sql, function(err, result){
        if(result.length <= 0)
            message = "No records found!";

        db.query(sql1, function(err, results){
            if(results.length <= 0)
                message = "No data found!";
            //course_title = results[0].course_title;
            //course_des = results[0].course_des;


            db.query(sql_quiz, function (err, rows1, fields) {
                if (err) {
                    throw err;
                }
                else
                {
                    console.log("count row: "+rows1.length);
                }
                res.render('view_course_student.ejs', {id:userId,user:user,data:result,rows1:rows1,results:results,message: message,title: 'Courses'});
            });
        });
        //console.log(rows);
    });
};




exports.postans = function(req, res, next){
    message = '';

    var user =  req.session.username,
        userId = req.session.userID;

    if(userId == null){
        res.redirect("/");
        return;
    }
    var date = new Date();
    if(req.method == "POST"){
        var post  = req.body;
        var correct_ans= post.correct_ans;
        var question_id= post.question_id;
        console.log('correct_ans'+correct_ans);
        console.log('question_id'+question_id);
// check if user has already answered

        var sql = "INSERT INTO `tbl_answers`(`answer`,`user_id`,`question_id`,`created`) VALUES ('" + correct_ans + "','" + userId + "','" + question_id + "','"+date+"')";
        console.log('sql'+sql);
        var query = db.query(sql, function(err, result) {
            if (err){
                throw err;
            }
            else {
                message = "Succesfully! Your course has been created.";
                res.render('hello.ejs', {id: userId, title: 'hello'});
            }
        });

    } else {
        res.render('hello',{id:userId,title: 'hello'});
    }
};


exports.viewResult = function(req, res, next){
    message = '';

    var user =  req.session.username,
        userId = req.session.userID;

    if(userId == null){
        res.redirect("/");
        return;
    }
    if(req.method == "POST"){
        var post  = req.body;
        var correct_ans= post.correct_ans;
        var question_id= post.question_id;

    } else {
        res.render('viewResult_student.ejs', {id:userId,title: 'hello'});
    }
};


exports.dashboard = function(req, res, next){
    var title ='';
    var user =  req.session.username,
        userId = req.session.userID;

    if(userId == null){
        res.redirect("/");
        return;
    }

    var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";

    db.query(sql, function(err, results){

        if(results){

            res.render('home.ejs', {id:userId,user:user,data:results, title: 'Home'});
        }
        else {
            console.log(err);
        }
    });

};

