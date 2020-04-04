// *********************************
// ** book management module:
// *********************************
module.exports = function (app) {
    // *********************************
    // ** Get: /mBook
    // **   Init process for the page of book management.
    // *********************************
    app.get('/mBook', function (req, res) {
        console.log("Get:/mBook run");
        // Session Check
        let owner;
        try {
            owner = req.session.user.name;
        } catch (e) {
            res.redirect('500');
            return;
        }
        // Init data
        res.render('mBook', {data: '', ISBN: '', title: '', year: '', author: ''});
    });

    // *********************************
    // ** Post: /mBook
    // **   When the flag is null, Get book list from database
    // **   When the flag is delete, Delete the book from database
    // **   When the flag is add, Jump to edit book page
    // *********************************
    app.post('/mBook', function (req, res) {
        console.log("Post:/mBook run");
        // Get book model
        let Book = global.dbHelper.getModel('book');
        // Session check
        let owner;
        try {
            owner = req.session.user.name;
        } catch (e) {
            res.redirect('500');
            return;
        }

        // Get data from page
        let isbn = req.body.isbn;
        let title = req.body.title;
        let year = req.body.year;
        let author = req.body.author;
        let Cisbn = req.body.Cisbn;
        let flg = req.body.flg;
        // Delete button
        if (flg == 'delete') {
            // Delete the data from database
            Book.deleteOne({ISBN: Cisbn, owner: owner}, function (err) {
                if (err) {
                    console.log(error);
                    res.render('500');
                }
            });
        }
        // Update button
        else if (flg == 'add') {
            let url = 'editBook?flg=u&isbn=' + Cisbn + '&owner=' + owner;
            console.log("redirect:" + url);
            // Jump to edit book page
            res.redirect(url);
            return;
        }

        // Edit the search conditions
        let condition = {owner: owner};
        if (isbn != '') {
            condition['ISBN'] = {$regex: isbn, $options: 'i'};
        }
        if (title != '') {
            condition['title'] = {$regex: title, $options: 'i'};
        }
        if (year != '') {
            condition['year'] = {$regex: year, $options: 'i'};
        }
        if (author != '') {
            condition['author'] = {$regex: author, $options: 'i'};
        }
        // Search data by condition
        Book.find(condition, function (err, books) {
            if (err) {
                console.log(error);
                res.render('500');
            }
            res.render('mBook', {data: books, ISBN: isbn, title: title, year: year, author: author});
        });
    });
}


