module.exports = function ( app ) {
    app.get('/register', function(req, res) {
        res.render('register.html');
    });

    app.post('/register', function (req, res) {
        var User = global.dbHelper.getModel('user'),
            uname = req.body.uname;
        User.findOne({name: uname}, function (error, doc) {
            if (error) {
                res.send(500);
                req.session.error = 'The network is error！';
                console.log(error);
            } else if (doc) {
                req.session.error = 'The user is exist！';
                res.send(500);
            } else {
                User.create({
                    name: uname,
                    password: req.body.upwd
                }, function (error, doc) {
                    if (error) {
                        console.log(error);
                        res.send(500);
                    } else {
                        req.session.error = 'Create Ok！';
                        console.log('Create OK');
                        res.send(200);
                    }
                });
            }
        });
    });
}