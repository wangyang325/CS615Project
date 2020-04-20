// *********************************
// ** register module:
// *********************************
// module.exports = function (app) {
//     // *********************************
//     // ** Get: /register
//     // **   Init process for the page of register.
//     // *********************************
//     app.get('/reset', function (req, res) {
//         console.log("Get:/reset run");
//         res.render('reset');
//     });
//
//     // *********************************
//     // ** Post: /register
//     // **   Register the user into database
//     // *********************************
//     app.post('/reset', function (req, res) {
//         console.log("Post:/reset run");
//         // Get user data
//         let User = global.dbHelper.getModel('user');
//         let username = req.body.username;
//         // Check the user if exists
//         User.findOne({name: username}, function (error, doc) {
//             // Error
//             if (error) {
//                 req.session.error = 'The' +
//                     ' network is error！';
//                 res.send(500);
//             }
//         }).then(function (doc) {
//             if (doc) {
//                 // If the user exists, show message
//                 req.session.error = 'The user is exist！';
//                 res.send({'msg': 'The user is exist！'});
//             } else {
//                 // Insert the user into database
//                 User.create({
//                     name: username,
//                     password: req.body.password
//                 }, function (error, doc) {
//                     // Error
//                     if (error) {
//                         console.log(error);
//                         res.send(500);
//                     } else {
//                         // Insert successfully
//                         req.session.error = 'Create Ok！';
//                         res.redirect('/login');
//                     }
//                 });
//             }
//         })
//     });
// }




// *********************************
// ** register module:
// *********************************
module.exports = function (app) {
    // *********************************
    // ** Get: /register
    // **   Init process for the page of register.
    // *********************************
    app.get('/changepassword', function (req, res) {
        console.log("Get:/changepassword run");
        res.render('changepassword');
    });

    // *********************************
    // ** Post: /register
    // **   Register the user into database
    // *********************************
    app.post('/changepassword', function (req, res) {
        console.log("Post:/reset run");
        // Get user data
        let User = global.dbHelper.getModel('user');
        let username = req.body.username;
        // Check the user if exists
        User.findOne({name: username}, function (error, doc) {
            // Error
            if (error) {
                req.session.error = 'The' +
                    ' network is error！';
                res.send(500);
            }
        }).then(function (user) {
            if (user) {
                // If the user exists, show message
                if (user.password == req.body.cpassword) {
                    // Update password
                    User.updateOne({name: username}, {
                        password: req.body.password
                    }).then(()=>{
                        res.send("Password changed")
                    })
                }else
                {
                    res.render("incorrectpassword")
                }
            } else {

                res.render('nouser');
            }
        })
    });
}
