module.exports = function ( app ) {
    require('./login')(app);
    require('./home')(app);
    require('./logout')(app);
    require('./register')(app);
    require('./cart')(app);
    require('./test')(app);
    require('./editBook')(app);
    require('./listBook')(app);
    require('./error500')(app);
};