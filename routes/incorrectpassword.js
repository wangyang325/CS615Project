module.exports = function (app) {
    // *********************************
    // ** Get: /register
    // **   Init process for the page of register.
    // *********************************
    app.get('/incorrectpassword', function (req, res) {
        console.log("Get:/nor run");
        res.render('incorrectpassword');
    });}