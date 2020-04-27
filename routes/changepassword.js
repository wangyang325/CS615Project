
// *********************************
// ** register module:
// *********************************
module.exports = function (app) {
    // *********************************
    // ** Get: /register
    // **   Init process for the page of register.
    // *********************************
    app.get('/changepassword', function (req, res) {
        console.log("Get:/changepassword run");
        res.render('changepassword');
    });

    // *********************************
    // ** Post: /register
    // **   Register the user into database
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
                    //res.render("incorrectpassword")
                    res.render("changepassword", {'msg': 'Incorrect Password!!'})

                }
            } else {

               // res.render('nouser');
                res.render("changepassword", {'msg': 'No User Exists!!'})
            }
        })
    });
}
