module.exports = function (app) {
    // *********************************
    // ** Get: /register
    // **   Init process for the page of register.
    // *********************************
    app.get('/nouser', function (req, res) {
        console.log("Get:/nouser run");
        res.render('nouser');
    });}