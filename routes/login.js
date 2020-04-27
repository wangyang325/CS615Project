// *********************************
// ** Login module:
// *********************************
module.exports = function (app) {
    // *********************************
    // ** Get: /login
    // **   Init process for the page of login.
    // *********************************
    app.get('/login', function (req, res) {
        console.log("Get:/login run");
        // clear session
        req.session.user = null;
        res.render('login');
    });

    // *********************************
    // ** Post: /login
    // **   Check user data
    // *********************************
    app.post('/login', function (req, res) {
        console.log("Post:/login run");
        // Get user model
        let User = global.dbHelper.getModel('user');
        let username = req.body.username;
        let password = req.body.password;
        // Search user by name
        User.findOne({name: username}, function (error, doc) {
            if (error) {
                // Error
                res.send(500);
                console.log(error);
            } else if (!doc) {
                // The user does not exist. (Error)
                req.session.error = 'The user dose not exist!';
               // res.send({'msg': 'The user dose not exist!!'});
                res.render("login", {'msg': 'The user dose not exist!!'})

            }
        }).then(function (doc) {
            // Check the password
            if (password != doc.password) {
                req.session.error = "The password is wrong!";
               // res.send({'msg': 'The password is wrong!!'});
                res.render("login", {'msg': 'The password is wrong!!'})
            } else {
                // Check Ok, jump to personal section page
                req.session.user = doc;
                console.log("Login:OK");
                res.redirect('/pSection');
            }
        })
    });
}