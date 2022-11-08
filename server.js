const express = require('express');
const app = express();

app.use(express.urlencoded({
    extended: true
}))

app.set('view engine', 'ejs');

var cookieParser = require('cookie-parser');
app.use(cookieParser("#9zeyx$5Pf"));

var session = require('express-session');
app.use(session({ secret: '1YWmWc@t20', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));


const loginRouter = require('./routes/login')
app.use('/login', loginRouter)

const userRouter = require('./routes/user')
app.use('/user', userRouter)

const data = require('./api/data')

var i = 0;

app.get('/', (req, res) => {
  res.render('index', { logged: loginRouter.is_logged(req, res) , username: data.get_username(req, res), login_error: req.session.login_error });
  req.session.login_error = false;
  req.session.save();
})

app.get('*', (req, res) => {
  if (!loginRouter.is_logged(req, res)) {
    res.redirect('/');
  }
})

app.listen(8987);