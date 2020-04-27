


// *********************************
// ** register module:
// *********************************
module.exports = function (app) {
    // *********************************
    // ** Get: /register
    // **   Init process for the page of register.
    // *********************************
    app.get('/reset', function (req, res) {
        console.log("Get:/reset run");
        res.render('reset');
    });

    // *********************************
    // ** Post: /register
    // **   Register the user into database
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
                       res.render("reset", {'success': 'Password Reset done successfully!!'})
                   })
               }else
               {
                   //res.render("incorrectanswer")
                   res.render("reset", {'msg': 'Incorrect security answer.Please provide valid answer!!'})

               }
            } else {

                res.render("reset", {'msg': 'No User exists .Please sign up!!'})
            }
        })
    });
}
