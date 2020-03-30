module.exports = function ( app ) {
    app.get('/register', function(req, res) {
        console.log("Get:/register run");
        res.render('register');
    });

    app.post('/register', function (req, res) {
        console.log("Post:/register run");
        let User = global.dbHelper.getModel('user');
        let username = req.body.username;
        User.findOne({name: username}, function (error, doc) {
            if (error) {
                req.session.error = 'The network is error！';
                res.send(500);
            }
        }).then(function (doc) {
            if (doc) {
                req.session.error = 'The user is exist！';
                res.send({'msg': 'The user is exist！'});
            } else {
                User.create({
                    name: username,
                    password: req.body.password
                }, function (error, doc) {
                    if (error) {
                        console.log(error);
                        res.send(500);
                    } else {
                        req.session.error = 'Create Ok！';
                        res.redirect('/login');
                    }
                });
            }

        })
    });
}