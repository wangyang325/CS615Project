module.exports = function ( app ) {
    require('./login')(app);
    require('./logout')(app);
    require('./register')(app);
    require('./test')(app);
    require('./editBook')(app);
    require('./listBook')(app);
    require('./error500')(app);
};