module.exports = function ( app ) {
    app.get('/pSection',function(req,res){
        console.log("Get:/pSection run");
        let Book = global.dbHelper.getModel('book');
        let owner = 'Yang';
        Book.find({owner: owner}, function (err, books) {
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

            res.render('pSection', {data:'', topic:topics, checkedId:'', checkAll:checkA});

        })
    });

    app.post('/pSection', function (req, res) {
        console.log("Post:/pSection run");
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
        let owner = 'Yang';
        let condition = {owner: owner};

        let conArr = new Array();
        if (topicData.length == 1) {
            condition['metadata']  = { $regex: '[' + topicData[0] + ']', $options: 'i' };
        } else {
            for (let i in topicData) {
                conArr.push({metadata : { $regex: '[' + topicData[i] + ']', $options: 'i' }});
            }
            if (conArr.length == 0) {
                condition = {owner: owner};
            } else {
                condition = {owner: owner, $or: conArr};
            }
        }
        Book.find(condition, function (err, books) {
            if (err) {
                console.log(error);
                res.render('500');
            }
        }).then(function (books) {
            for (let j in books) {
                for (let i in topicData) {
                    if (books[j].metadata.indexOf(topicData[i]) != -1) {
                        let book = {topic: topicData[i], book:books[j]};
                        listData.push(book);
                    }
                }
            }
            res.render('pSection', {data: listData, topic: topicAll, checkedId: checkedId, checkAll:checkA});
        });
    });
}



