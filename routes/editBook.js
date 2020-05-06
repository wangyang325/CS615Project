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
                            res.render('mBook', {data: '', ISBN: '', title: '', year: '', author: '', user: req.session.user.name});
                        }
                    });
                }
                // if the book is existing
                else {
                    // If the user exists, show message
                    // Transfer the data to page
                    res.render('editBook', {data: doc, flg: {flg: req.query.flg}, user: req.session.user.name, 'msg': 'The book already exist!!'});
                    req.session.error = 'The book is exist！';
                }
            });
        }
    });
}