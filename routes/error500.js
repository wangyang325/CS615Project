module.exports = function ( app ) {
    app.get('/error500', function (req, res) {
        console.log("Get:/error500 run");
        res.render('500');
    });
}