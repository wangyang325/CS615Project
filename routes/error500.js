module.exports = function ( app ) {
    app.get('/error500', function (req, res) {
        res.render('500');
    });
}