module.exports = function ( app ) {
    app.get('/listBook',function(req,res){
        console.log("Get:/listBook run");
        res.render('listBook', {data:''});
    });

    app.post('/listBook', function (req, res) {
        console.log("Post:/listBook run");
        let Book = global.dbHelper.getModel('book');
        let uname = 'Yang';
        let isbn = req.body.isbn;
        Book.updateOne({'owner': uname, 'ISBN': isbn},
            {
                title : req.body.title,
                author : req.body.author,
                year : req.body.year,
                abstract : req.body.abstract,
                metadata : req.body.metadata
            },
            function (error, doc) {
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


