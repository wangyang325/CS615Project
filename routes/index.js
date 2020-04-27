// *********************************
// ** Router module:
// *********************************
module.exports = function ( app ) {
    require('./login')(app);
    require('./register')(app);
    require('./reset')(app);
    require('./changepassword')(app);
    require('./editBook')(app);
    require('./500')(app);
    require('./mBook')(app);
    require('./pSection')(app);
    require('./sSection')(app);
};