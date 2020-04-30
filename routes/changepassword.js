// *********************************
// ** change password module:
// *********************************
module.exports = function (app) {
    // *********************************
    // ** Get: /changepassword
    // **   Init process for the page of changepassword.
    // *********************************
    app.get('/changepassword', function (req, res) {
        console.log("Get:/changepassword run");
        res.render('changepassword');
    });

    // *********************************
    // ** Post: /changepassword
    // **   Change Password
    // *********************************
    app.post('/changepassword', function (req, res) {
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
                if (user.password == req.body.cpassword) {
                    // Update password
                    User.updateOne({name: username}, {
                        password: req.body.password
                    }).then(()=>{
                        res.render("changepassword", {'success': 'Password Changed!!'})
                    })
                }else
                {
                    // show error message if the old password is wrong
                    res.render("changepassword", {'msg': 'Incorrect Password!!'})
                }
            } else {
               // show error if the user name is not exists.
                res.render("changepassword", {'msg': 'No User Exists!!'})
            }
        })
    });
}
