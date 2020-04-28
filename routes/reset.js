// *********************************
// ** register module:
// *********************************
module.exports = function (app) {
    // *********************************
    // ** Get: /reset
    // **   Reset Password.
    // *********************************
    app.get('/reset', function (req, res) {
        console.log("Get:/reset run");
        res.render('reset');
    });

    // *********************************
    // ** Post: /reset
    // **   Reset Password
    // *********************************
    app.post('/reset', function (req, res) {
        console.log("Post:/reset run");
        // Get user data
        let User = global.dbHelper.getModel('user');
        let username = req.body.username;
        // Check the user if exists
        User.findOne({name: username}, function (error, doc) {
            // Error
            if (error) {
                req.session.error = 'The' +
                    ' network is error！';
                res.send(500);
            }
        }).then(function (user) {
            if (user) {
                // If the user exists, show message
               if (user.securityAnswer == req.body.question + '' + req.body.answer) {
                   // Update password
                   User.updateOne({name: username}, {
                       password: req.body.password
                   }).then(()=>{
                       // show success message once reset gets done !!
                       res.render("reset", {'success': 'Password Reset done successfully!!'})
                   })
               }else
               {
                   // show error if the security answer entered is not correct !!
                   res.render("reset", {'msg': 'Incorrect security answer.Please provide valid answer!!'})
               }
            } else {
                // show error if the there is no user exists
                res.render("reset", {'msg': 'No User exists .Please sign up!!'})
            }
        })
    });
}
