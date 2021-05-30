var createError = require('http-errors');
var express = require('express');

const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken')

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');

var app = express();

// 改写
var http = require('http');
var server = http.createServer(app);

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// 跨域问题解决方法
app.use(cors({
  origin:['http://192.168.0.9:8080'],
  methods:['GET','POST'],
}));
app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://192.168.0.9:8080');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
　next();　
});

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// 静态资源
app.use(express.static(path.join(__dirname, 'public')));
// post请求
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/admin', adminRouter);
app.use('/api/users', usersRouter);

// token验证中间件
app.use(function(req, res, next) {
 // req.url 表示当前地址
 const { url, headers: { authorization: token } } = req
//  console.log('token验证url: ', url)
 // const url = req.url
 // const { authorization: token } = req.headers
 // const token = req.headers.authorization

 // 不需要验证的请求地址
 if (url === '/' || url === '/staffLogin') return next()

 // 来到这里表示需要 token 验证
 if (!token) return res.send({ message: '请携带 token 请求', code: 0 })

 jwt.verify(token, 'Josiah', (err, data) => {
   if (err && err.message === 'invalid token') return res.send({ message: '无效 token', code: 0 })
   if (err && err.message === 'jwt expired') return res.send({ message: 'token 失效', code: 0 })
   next()
 })
})

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;
server.listen('3000');
