module.exports = function (app) {
    app.get('/editBook', function (req, res) {
        console.log("Get:/editBook run");
        res.render('editBook');
    });

    app.post('/editBook', function (req, res) {
        console.log("Post:/editBook run");
        let Book = global.dbHelper.getModel('book');
        let Suggestion = global.dbHelper.getModel('suggestion');
        //let uname = req.session.user.name;
        let uname = 'Yang';
        let isbn = req.body.isbn;
        let title = req.body.title;
        let author = req.body.author;
        let year = req.body.year;
        let abstract = req.body.abstract;
        let metadata = req.body.metadata;
        let shared = req.body.shared;
        let suggestion = req.body.suggestion;

        Book.findOne({'owner': uname, 'ISBN': isbn}, function (error, doc) {
            if (error) {
                res.send(500);
                console.log(error);
            } else if (!doc) {
                Book.create({
                    ISBN: isbn,
                    owner: uname,
                    title: title,
                    author: author,
                    year: year,
                    abstract: abstract,
                    metadata: metadata,
                    shared: shared
                }, function (error, doc) {
                    if (error) {
                        console.log(error);
                        res.send(500);
                    } else {
                        if (shared) {
                            Suggestion.create({
                                ISBN: isbn,
                                user: uname,
                                comment: suggestion
                            }, function (error, doc) {
                                if (error) {
                                    console.log(error);
                                    res.send(500);
                                } else {
                                    res.send(200);
                                }
                            });
                        }
                        res.send(200);
                    }
                });
            } else {
            }
        });
    });

}