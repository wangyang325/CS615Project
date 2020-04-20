module.exports = function (app) {
    // *********************************
    // ** Get: /register
    // **   Init process for the page of register.
    // *********************************
    app.get('/userexist', function (req, res) {
        console.log("Get:/userexist run");
        res.render('userexist');
    });}