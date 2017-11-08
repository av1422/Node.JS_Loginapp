var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');


//create routes (routes folder with index and users files)
var routes = require('./routes/index');
var users = require('./routes/users');


//init app
var app=express();

//setup view engine

app.set('views', path.join(__dirname,'views')); //here we r creating views folder to handle our views
app.engine('handlebars', exphbs({defaultLayout:'layout'}));//set handle bars as app.engine, and default layout to be layout
app.set('view engine','handlebars');


//bodyparsers middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

//set static folder
app.use(express.static(path.join(__dirname,'public')));

//we keep stylesheets and images all those files as public 



//express session

app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

//passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));



//connect flash
app.use(flash());

//set global variables for our flash messages
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


app.use('/', routes);
app.use('/users', users);

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});


