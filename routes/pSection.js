let common = require('../common/common.js');
// *********************************
// ** personal section module:
// *********************************
module.exports = function (app) {
    // *********************************
    // ** Get: /pSection
    // **   Init process for the page of personal section.
    // *********************************
    app.get('/pSection', function (req, res) {
        console.log("Get:/pSection run");
        // Get book model
        let Book = global.dbHelper.getModel('book');

        // Session Check
        let owner;
        try {
            owner = req.session.user.name;
        } catch (e) {
            res.redirect('500');
            return;
        }

        // Search book by owner
        Book.find({owner: owner}, function (err, books) {
            if (err) {
                console.log(error);
                res.render('500');
            }
        }).then(function (books) {
            // if the book exists
            let topics = new Array();
            let checkA = '';
            // Get the books' topics
            for (let i in books) {
                let meta = books[i].metadata;
                let ary = meta.split(',');
                for (let j in ary) {
                    let nowS = ary[j];
                    nowS = nowS.replace('[', '');
                    nowS = nowS.replace(']', '');
                    if (topics[nowS] == null) {
                        topics[nowS] = nowS;
                        checkA = checkA + ',' + nowS;
                    }
                }
            }
            res.render('pSection', {data: '', topic: topics, checkedId: '', checkAll: checkA, user: req.session.user.name});
        })
    });

    // *********************************
    // ** Post: /pSection
    // **   Get the book list by topic
    // *********************************
    app.post('/pSection', function (req, res) {
        console.log("Post:/pSection run");
        // Session Checks
        let owner;
        try {
            owner = req.session.user.name;
        } catch (e) {
            res.redirect('500');
            return;
        }

        // Get the checkbox data by analyzing the string
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
        // when Checkbox is off, set a default value
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

        // Edit the search conditions
        let listData = new Array();
        let Book = global.dbHelper.getModel('book');
        // Condition for owner
        let condition = {owner: owner};
        // Condition for metadata
        let conArr = new Array();
        if (topicData.length == 1) {
            condition['metadata'] = {$regex: '[' + topicData[0] + ']', $options: 'i'};
        } else {
            for (let i in topicData) {
                conArr.push({metadata: {$regex: '[' + topicData[i] + ']', $options: 'i'}});
            }
            if (conArr.length == 0) {
                condition = {owner: owner};
            } else {
                condition = {owner: owner, $or: conArr};
            }
        }
        // Search the data by condition
        Book.find(condition, function (err, books) {
            if (err) {
                console.log(error);
                res.render('500');
            }
        }).then(function (books) {
            // Edit the book data
            for (let j in books) {
                for (let i in topicData) {
                    if (books[j].metadata.indexOf(topicData[i]) != -1) {
                        let book = {topic: topicData[i], book: books[j]};
                        listData.push(book);
                    }
                }
            }
            listData = common.JsonSort(listData, 'topic');
            res.render('pSection', {data: listData, topic: topicAll, checkedId: checkedId, checkAll: checkA, user: req.session.user.name});
        });
    });
}



