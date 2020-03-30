module.exports = function ( app ) {
    app.get('/sSection',function(req,res){
        console.log("Get:/sSection run");
        let Book = global.dbHelper.getModel('book');

        let owner;
        try {
            owner = req.session.user.name;
        } catch (e) {
            res.redirect('500');
            return;
        }

        Book.aggregate([
            {$group: {_id: '$ISBN', total: {$sum: 1}}},
            {$match: {total: {$gt: 2}}}
        ], (err, books) => {
            let conArr = new Array();
            for (let i in books) {
                conArr.push({ISBN : books[i]._id});
            }
            if (conArr.length > 0) {
                let condition = {$or: conArr};
                Book.find(condition, function (err, books) {
                    if (err) {
                        console.log(error);
                        res.render('500');
                    }
                }).then(function (books) {
                    let topics = new Array();
                    let checkA = '';
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
                    res.render('sSection', {data:'', topic:topics, checkedId:'', checkAll:checkA});
                })
            }
        })
    });

    app.post('/sSection', function (req, res) {
        console.log("Post:/sSection run");
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

        if (typeof(checkbox) === "undefined") {
            checkbox = '';
        }
        let checkedId = req.body.checkedId;
        if (Array.isArray(checkbox)) {
            for (let i in checkbox) {
                topicData.push(checkbox[i]);
            }
        } else if(checkbox !='') {
            topicData.push(checkbox);
        } else {
            topicData = topicAll;
        }

        let listData = new Array();

        let Book = global.dbHelper.getModel('book');
        let condition = new Array();

        let conArr1 = new Array();
        for (let i in topicData) {
            conArr1.push({metadata : { $regex: '[' + topicData[i] + ']', $options: 'i' }});
        }
        condition = {$or: conArr1};

        let heat = new Array();
        Book.aggregate([
            {$group: {_id: '$ISBN', total: {$sum: 1}}},
            {$match: {total: {$gt: 2}}}
        ], (err, books) => {
            let conArr2 = new Array();
            for (let i in books) {
                conArr2.push(books[i]._id);
                heat[books[i]._id] = books[i].total;
            }
            if (conArr2.length > 0) {
                condition['ISBN'] = {$in: conArr2};
                console.log(condition);
                Book.find(condition, function (err, books) {
                    if (err) {
                        console.log(error);
                        res.render('500');
                    }
                }).then(function (books) {
                    let checkB = new Array();
                    for (let j in books) {
                        if (checkB[books[j].ISBN] == null) {
                            for (let i in topicData) {
                                if (books[j].metadata.indexOf(topicData[i]) != -1) {
                                    let book = {topic: topicData[i], book: books[j], heat: heat[books[j].ISBN]};
                                    listData.push(book);
                                }
                            }
                        }
                        checkB[books[j].ISBN] = books[j].ISBN;
                    }
                    res.render('sSection', {data: listData, topic: topicAll, checkedId: checkedId, checkAll: checkA});
                });
            }
        });
    });
}


