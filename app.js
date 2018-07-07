var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var session = require('express-session');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var passport = require('passport');

/*
var mysql = require('mysql');
var conn = mysql.createConnection({
  host: '58.123.136.107',
  port: '3308',
  user: 'web',
  password: 'mju12345',
  database : 'medic'
});
conn.connect();

쿼리 예시문입니당~~
conn.query('SELECT * FROM patient',function(err, rows, fields) {
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.', err);
});*/

/*-----------------Routes 파일 불러오기-----------------*/
var index = require('./routes/statistics');
var diagnosis = require('./routes/diagnosis');
var receipt = require('./routes/receipt');
var monitor = require('./routes/monitor');
var patientmanagement = require('./routes/patientmanagement');
var surgery = require('./routes/surgery');
var superadmin = require('./routes/superadmin');
var api = require('./routes/api');
var login = require('./routes/login')
/*-----------------Routes 파일 불러오기-----------------*/
var app = express();

// view를 뭘로 쓸지 결정 - pug, html 등
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.locals.moment = require('moment');
app.locals.querystring = require('querystring');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));

// session을 사용할 수 있도록.
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'long-long-long-secret-string-1313513tefgwdsvbjkvasd'
}));
app.use(flash()); // flash message를 사용할 수 있도록
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));//node 모듈 사용가능하게끔

/*-----------------------로그인------------------*/
app.use(passport.initialize());
app.use(passport.session());

/*
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
};검증됬는지 확인

router.get('/myinfo', isAuthenticated, function (req, res) {
  res.render('myinfo',{
    title: 'My Info',
    user_info: req.user
  })
});사용법 예시
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});
*/

app.use(function (req, res, next) {
  console.log("REQ USER", req.user);
  res.locals.currentUser = req.user;
  res.locals.flashMessages = req.flash();
  next();
});
/*-----------------------로그인 끝------------------*/

/*-----------------url route-----------------*/
app.use('/', index);
app.use('/monitor', monitor);
app.use('/receipt', receipt);
app.use('/diagnosis', diagnosis);
app.use('/patientmanagement', patientmanagement);
app.use('/surgery', surgery);
app.use('/superadmin', superadmin);
app.use('/api/v1', api);
app.use('/login', login);
/*-----------------url route-----------------*/



// 에러처리
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('includes/error');//에러페이지 설정
});

module.exports = app;
