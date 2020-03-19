module.exports = function ( app ) {
    app.get('/login',function(req,res){
        console.log("Get:/login run");
        res.render('login.html');
    });

    app.post('/login', function (req, res) {
        console.log("Post:/login run");
        let User = global.dbHelper.getModel('user');
        let username = req.body.username;
        let password = req.body.password;
        User.findOne({name: username}, function (error, doc) {
            if (error) {
                res.send(500);
                console.log(error);
            } else if (!doc) {
                req.session.error = 'The user dose not exist!';
                res.send({'msg': 'The user dose not exist!!'});
            } else {
               if(req.body.password != doc.password){
                   req.session.error = "The password is wrong!";
                   res.send({'msg': 'The password is wrong!!'});
               }else{
                   req.session.user=doc;
                   console.log("Login:OK");
                   res.send({'msg': 'ok'});
                   //res.location('listBook');
                   //res.location('/listBook');

               }
        }
        });
    });

}