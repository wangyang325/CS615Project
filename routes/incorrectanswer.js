module.exports = function (app) {
    // *********************************
    // ** Get: /register
    // **   Init process for the page of register.
    // *********************************
    app.get('/incorrectanswer', function (req, res) {
        console.log("Get:/incorrectanswer run");
        res.render('incorrectanswer');
    });}