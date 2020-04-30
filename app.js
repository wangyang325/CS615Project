// Set express
let express = require('express');
let app = express();
let path = require('path');
let bodyParser = require('body-parser');
let session = require('express-session');

// Set mongoose
let mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
global.dbHelper = require( './common/dbHelper' );
// Db connect
let DB_URL = "mongodb://192.168.121.26:27017/Test";
global.db = mongoose.connect(DB_URL, function(err, db) {
        if (err) throw err;
        console.log("Database created!");
});

// Store the session to db
app.use(session({
    secret:'secret',
    cookie:{
        maxAge:1000*60*30
    }
}));

// Set view
app.set('views', path.join(__dirname, 'views'));

// Set view engine
let ejs = require('ejs');
app.set( 'view engine', 'html' );
app.engine( 'html', require( 'ejs' ).__express );
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set static file
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
    res.locals.user = req.session.user;
    let err = req.session.error;
    res.locals.message = '';
    if (err) res.locals.message = '<div class="alert alert-danger" style="margin-bottom: 20px;color:#ff0000;">' + err + '</div>';
    next();
});

// Set router
require('./routes')(app);

// Default page
app.get('/', function(req, res) {
    res.render('login.html');
});

// listener port
app.listen(3000);


