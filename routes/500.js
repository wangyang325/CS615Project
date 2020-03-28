module.exports = function ( app ) {
    app.get('/500', function (req, res) {
        console.log("Get:/500 run");
        res.render('500');
    });
}