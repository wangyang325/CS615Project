module.exports = function (app) {
    app.get('/editBook', function (req, res) {
        console.log("Get:/editBook run");
        let Book = global.dbHelper.getModel('book');
        if (req.query.flg === 'u' || req.query.flg === 'r' || req.query.flg === 'd') {
            let owner = req.query.owner;
            let isbn = req.query.isbn;
            Book.findOne({'owner': owner, 'ISBN': isbn}, function (error, doc) {
                if (error) {
                    res.render('500');
                    console.log(error);
                } else if (doc) {
                    res.render('editBook', {data:doc, flg:{flg:req.query.flg}});
                } else {
                    res.render('500');
                    console.log("The book does not exist!!");
                }
            });

        } else {
            res.render('editBook', {data: {author: '', isbn: '', title: '', year: '', abstract: '', metadata: ''}, flg:{flg:'a'}});
        }
    });

    app.post('/editBook', function (req, res) {
        console.log("Post:/editBook run");

        let Book = global.dbHelper.getModel('book');
        //let uname = req.session.user.name;
        let owner = 'Yang';
        let isbn = req.body.isbn;
        let title = req.body.title;
        let author = req.body.author;
        let year = req.body.year;
        let abstract = req.body.abstract;
        let metadata = req.body.metadata;

        if (req.body.flg === 'u') {
            let newData = {
                title: title,
                author: author,
                year: year,
                abstract: abstract,
                metadata: metadata
            };
            Book.findOneAndUpdate({'owner': owner, 'ISBN': isbn}, newData, function(err, doc) {
                if (err) {
                    res.render('500');
                    console.log(error);
                } else {
                    //
                }
            });
            console.log("render: mBook");
            res.render('mBook',  {data:'', ISBN:'', title:'', year:'', author:''});
        }
        else if (req.body.flg === 'd') {
            Book.findOne({'owner': owner, 'ISBN': isbn}, function (error, doc) {
                if (error) {
                    res.render('500');
                    console.log(error);
                } else if (doc) {
                    doc.remove();
                    res.render('mBook',  {data:'', ISBN:'', title:'', year:'', author:''});
                }
            });
        }
        else {
            Book.findOne({'owner': owner, 'ISBN': isbn}, function (error, doc) {
                if (error) {
                    res.render('500');
                    console.log(error);
                } else if (!doc) {
                    Book.create({
                        ISBN: isbn,
                        owner: owner,
                        title: title,
                        author: author,
                        year: year,
                        abstract: abstract,
                        metadata: metadata
                    }, function (error, doc) {
                        if (error) {
                            console.log(error);
                            res.render('500');
                        } else {
                            res.render('mBook', {data:'', ISBN:'', title:'', year:'', author:''});
                        }
                    });
                }
            });
        }
    });

}