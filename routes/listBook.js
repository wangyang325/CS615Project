module.exports = function ( app ) {
    app.get('/listBook',function(req,res){
        res.render('listBook', {data:''});
    });

    app.post('/listBook', function (req, res) {
        console.log(req.body.title);
        let Book = global.dbHelper.getModel('book');
        Book.find(function (error, doc) {
            if (error) {
                res.send(500);
                console.log(error);
            } else if (!doc) {
                res.send(404);
            } else {
                // res.send(200, doc);
                res.render('listBook', {data:doc});
            }
        });
    });

}