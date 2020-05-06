let common = require('../common/common.js');
// *********************************
// ** Social section module:
// *********************************
module.exports = function (app) {
    // *********************************
    // ** Get: /sSection
    // **   Init process for the page of Social section.
    // *********************************
    app.get('/sSection', function (req, res) {
        console.log("Get:/sSection run");

        // Session Check
        let owner;
        try {
            owner = req.session.user.name;
        } catch (e) {
            res.redirect('login');
            return;
        }
        // Get book model
        let Book = global.dbHelper.getModel('book');

        // Get topics from book list
        let topics = new Array();
        let checkA = '';

        // find all books
        Book.find({}, function (err, books) {
            if (err) {
                console.log(error);
                res.render('500');
            }
        }).then(function (books) {
            // find owner
            let myBooks = new Array();
            let rsBooks = new Array();
            let myBooksMap = new Map();
            // get my books
            for (let i in books) {
                if (books[i].owner == owner) {
                    myBooks.push(books[i]);
                    myBooksMap.set(books[i].ISBN, 1);
                }
            }
            // share less 3 books, cannot see others
            if (myBooks.length < 2) {
                res.render('sSection', {data: '', topic: topics, checkedId: '', checkAll: checkA, user: req.session.user.name});
            } else {
                let myUser = new Map();
                // get the users who has the same books with login user
                for (let j in myBooks) {
                    let myBookIsbn = myBooks[j].ISBN;
                    for (let i in books) {
                        if (books[i].owner != owner) {
                            if (myBookIsbn == books[i].ISBN) {
                                if (myUser.get(books[i].owner) == null) {
                                    myUser.set(books[i].owner, 1);
                                }
                                else {
                                    myUser.set(books[i].owner, myUser.get(books[i].owner) + 1);
                                }
                            }
                        }
                    }
                }
                // get search condition from books
                for (let i in books) {
                    if (books[i].owner != owner) {
                        if (myUser.get(books[i].owner) > 2 ) {
                            if (myBooksMap.get(books[i].ISBN) == null) {
                                rsBooks.push(books[i]);
                                // Get topic from metadata
                                let meta = books[i].metadata;
                                let ary = meta.split(',');
                                for (let k in ary) {
                                    let nowS = ary[k];
                                    nowS = nowS.replace('[', '');
                                    nowS = nowS.replace(']', '');
                                    if (topics[nowS] == null) {
                                        topics[nowS] = nowS;
                                        checkA = checkA + ',' + nowS;
                                    }
                                }
                            }
                        }
                    }
                }
                res.render('sSection', {data: '', topic: topics, checkedId: '', checkAll: checkA, user: req.session.user.name});
            }
        });
    });

    // *********************************
    // ** Post: /sSection
    // **   Get the book list by topic
    // *********************************
    app.post('/sSection', function (req, res) {
        console.log("Post:/sSection run");
        // Session Check
        let owner;
        try {
            owner = req.session.user.name;
        } catch (e) {
            res.redirect('login');
            return;
        }

        // Get the checkbox data
        let topicData = new Array();
        let topicAll = new Array();
        let checkbox = req.body.checkBox;
        let checkA = req.body.checkAll;

        let ary = checkA.split(',');
        for (let j in ary) {
            if (ary[j] != '') {
                topicAll.push(ary[j]);
            }
        }
        // checkbox for condition
        if (typeof (checkbox) === "undefined") {
            checkbox = '';
        }
        let checkedId = req.body.checkedId;
        if (Array.isArray(checkbox)) {
            for (let i in checkbox) {
                topicData.push(checkbox[i]);
            }
        } else if (checkbox != '') {
            topicData.push(checkbox);
        } else {
            topicData = topicAll;
        }

        // Search the data by checked topic
        let listData = new Array();
        let Book = global.dbHelper.getModel('book');

        // find all books
        Book.find({}, function (err, books) {
            if (err) {
                console.log(error);
                res.render('500');
            }
        }).then(function (books) {
            // find owner
            let myBooks = new Array();
            let myBooksMap = new Map();
            for (let i in books) {
                if (books[i].owner == owner) {
                    myBooks.push(books[i]);
                    myBooksMap.set(books[i].ISBN, 1);
                }
            }
            // if share less 3 books, cannot see others
            if (myBooks.length < 2) {
                res.render('sSection', {data: '', topic: topicAll, checkedId: checkedId, checkAll: checkA, user: req.session.user.name});
            } else {
                let myUser = new Map();
                // find the users who have over 3 books
                for (let j in myBooks) {
                    let myBookIsbn = myBooks[j].ISBN;
                    for (let i in books) {
                        if (books[i].owner != owner) {
                            if (myBookIsbn == books[i].ISBN) {
                                if (myUser.get(books[i].owner) == null) {
                                    myUser.set(books[i].owner, 1);
                                }
                                else {
                                    myUser.set(books[i].owner, myUser.get(books[i].owner) + 1);
                                }
                            }
                        }
                    }
                }
                // edit book list
                for (let i in books) {
                    if (books[i].owner != owner) {
                        if (myUser.get(books[i].owner) > 2 ) {
                            // Edit the book list
                            let checkB = new Array();
                            if (checkB[books[i].ISBN] == null) {
                                for (let j in topicData) {
                                    if (books[i].metadata.indexOf(topicData[j]) != -1) {
                                        if (myBooksMap.get(books[i].ISBN) == null) {
                                            let book = {topic: topicData[j], book: books[i]};
                                            listData.push(book);
                                        }
                                    }
                                }
                            }
                            checkB[books[i].ISBN] = books[i].ISBN;
                        }
                    }
                }
                // sort the book
                listData = common.JsonSort(listData, 'topic')
                res.render('sSection', {data: listData, topic: topicAll, checkedId: checkedId, checkAll: checkA, user: req.session.user.name});
            }
        });
    });
}



