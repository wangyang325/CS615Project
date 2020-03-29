module.exports = function ( app ) {
    app.get('/mBook',function(req,res){
        console.log("Get:/mBook run");
        res.render('mBook', {data:'', ISBN:'', title:'', year:'', author:''});
    });

    app.post('/mBook', function (req, res) {
        console.log("Post:/mBook run");
        let Book = global.dbHelper.getModel('book');
        let owner = 'Yang';
        let isbn = req.body.isbn;
        let title = req.body.title;
        let year = req.body.year;
        let author = req.body.author;

        let Cisbn = req.body.Cisbn;

        let flg = req.body.flg;
        if (flg == 'delete') {
            owner = req.body.Cowner;
            Book.deleteOne({ ISBN: Cisbn, owner: owner }, function (err) {
                if (err) {
                    console.log(error);
                    res.render('500');
                }
            });
        } else if(flg == 'add') {
            let url = 'editBook?flg=u&isbn='+ Cisbn +'&owner=' + owner;
            console.log("redirect:" + url);
            res.redirect(url);
            return;
        }

        let condition = {owner: owner};
        if (isbn != '') {
            condition['ISBN'] = { $regex: isbn, $options: 'i' };
        }
        if (title != '') {
            condition['title'] = { $regex: title, $options: 'i' };
        }
        if (year != '') {
            condition['year'] = { $regex: year, $options: 'i' };
        }
        if (author != '') {
            condition['author'] = { $regex: author, $options: 'i' };
        }
        Book.find(condition, function (err, books) {
            if (err) {
                console.log(error);
                res.render('500');
            }
            res.render('mBook', {data:books, ISBN:isbn, title:title, year:year, author:author });
        });
    });

}


