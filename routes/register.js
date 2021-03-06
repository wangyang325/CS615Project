// *********************************
// ** register module:
// *********************************
module.exports = function (app) {
    // *********************************
    // ** Get: /register
    // **   Init process for the page of register.
    // *********************************
    app.get('/register', function (req, res) {
        console.log("Get:/register run");
        res.render('register');
    });

    // *********************************
    // ** Post: /register
    // **   Register the user into database
    // *********************************
    app.post('/register', function (req, res) {
        console.log("Post:/register run");
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
        }).then(function (doc) {
            if (doc) {
                // If the user exists, show message
                req.session.error = 'The user is exist！';
                res.render("register", {'msg': 'The user already exist!!'})
            } else {
                // Insert the user into database
                User.create({
                    name: username,
                    password: req.body.password,
                    securityAnswer:req.body.question + '' +req.body.answer
                }, function (error, doc) {
                    // Error
                    if (error) {
                        console.log(error);
                        res.send(500);
                    } else {
                        // Insert successfully
                        req.session.error = 'Create Ok！';
                        res.redirect('/login');
                    }
                });
            }
        })
    });
}