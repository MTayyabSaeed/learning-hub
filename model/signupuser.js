var express = require('express');
// var router = express.Router();
var date = require('date-and-time');

module.exports = {
    get_recent: function (req, res) {

        var today = new Date();
        var dateFormatted = date.format(today, 'YYYY-MM-DD');

            var users = {
                "userName" : req.body.username,
                "userEmail" :  req.body.useremail,
                "userType" : req.body.radiouser,
                "userPassword" : req.body.userpassword,
                "dateCreated" : dateFormatted
            };

            var sql = "INSERT into users (user_name, email, user_type, users_passwords, user_create_date) values ('" + users.userName
                + "','" + users.userEmail + "','" + users.userType + "','" + users.userPassword + "','" + users.dateCreated + "')";


            //Todo: check for more querries like the above to learn further how to handle data through querries of mySQL
        db.query(sql, function (err,results) {

                if (err){
                    console.log("Error Selecting : %s ", err);
                }else{

                    console.log("setting up user session");
                    // res.redirect('/faqs/faqsPage');
                    res.render('user/login', {message:"dat"});
                }
            });
    }
}
