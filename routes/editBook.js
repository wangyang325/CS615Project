// *********************************
// ** Edit book module:
// *********************************
module.exports = function (app) {
    // *********************************
    // ** Get: /editBook
    // **   Init process for the page of edit book.
    // *********************************
    app.get('/editBook', function (req, res) {
        console.log("Get:/editBook run");
        // Get Book model
        let Book = global.dbHelper.getModel('book');
        // Session check
        let owner;
        try {
            owner = req.session.user.name;
        } catch (e) {
            res.redirect('login');
            return;
        }
        // Render the page by flag(u: update, r: readonly, d: delete )
        if (req.query.flg === 'u' || req.query.flg === 'r' || req.query.flg === 'd') {
            // Get the owner and isbn from web page
            let owner = req.query.owner;
            let isbn = req.query.isbn;
            // Search collection by owner and ISBN
            Book.findOne({'owner': owner, 'ISBN': isbn}, function (error, doc) {
                if (error) {
                    // Selected data dose not exist. (Error)
                    res.render('500');
                    console.log(error);
                } else if (doc) {
                    // Transfer the data to page
                    res.render('editBook', {data: doc, flg: {flg: req.query.flg},user: req.session.user.name});
                } else {
                    // Selected data dose not exist. (Error)
                    res.render('500');
                    console.log("The book does not exist!!");
                }
            });
            // Init model
        } else {
            res.render('editBook', {
                data: {author: '', isbn: '', title: '', year: '', abstract: '', metadata: ''},
                flg: {flg: 'a'},user: req.session.user.name
            });
        }
    });

    // *********************************
    // ** Post: /editBook
    // **   Insert or update the data to database
    // *********************************
    app.post('/editBook', function (req, res) {
        console.log("Post:/editBook run");
        // Get the book model
        let Book = global.dbHelper.getModel('book');
        // Session check
        let owner;
        try {
            owner = req.session.user.name;
        } catch (e) {
            res.redirect('login');
            return;
        }

        // Get data from page
        let isbn = req.body.isbn;
        let title = req.body.title;
        let author = req.body.author;
        let year = req.body.year;
        let abstract = req.body.abstract;
        let metadata = req.body.metadata;

        // Update button
        if (req.body.flg === 'u') {
            let newData = {
                title: title,
                author: author,
                year: year,
                abstract: abstract,
                metadata: metadata
            };
            // Update the data to database
            Book.findOneAndUpdate({'owner': owner, 'ISBN': isbn}, newData, function (err, doc) {
                if (err) {
                    res.render('500');
                    console.log(error);
                } else {
                    //
                }
            });
            console.log("render: mBook");
            // Jump to mBook page
            res.render('mBook', {data: '', ISBN: '', title: '', year: '', author: '',user: req.session.user.name});
        }
        // Delete button
        else if (req.body.flg === 'd') {
            // Search the data
            Book.findOne({'owner': owner, 'ISBN': isbn}, function (error, doc) {
                if (error) {
                    // Error
                    res.render('500');
                    console.log(error);
                } else if (doc) {
                    // If it exists, delete the data from database
                    doc.remove();
                    res.render('mBook', {data: '', ISBN: '', title: '', year: '', author: '',user: req.session.user.name});
                }
            });
        }
        // Add button
        else {
            Book.findOne({'owner': owner, 'ISBN': isbn}, function (error, doc) {
                // Error
                if (error) {
                    res.render('500');
                    console.log(error);
                } else if (!doc) {
                    // If the data does not exist, insert a new data to database
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
                            // Error
                            res.render('500');
                        } else {
                            // Jump to mBook page
                            res.render('mBook', {data: '', ISBN: '', title: '', year: '', author: '',user: req.session.user.name});
                        }
                    });
                }
            });
        }
    });
}