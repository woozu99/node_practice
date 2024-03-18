const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

dotenv.config(); //이 다음 줄 부터 process.env 

const connect = require('./schemas');
const ColorHash = require('color-hash').default;

const webSocket = require('./socket');//웹소켓 설정

const indexRouter = require('./routers');

const app = express();

app.set('port', process.env.PORT || 8005);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

connect();//db연결

app.use(morgan('dev')); //로그찍기
app.use(express.static(path.join(__dirname, 'public'))); //폴더 static으로 변경
app.use('/gif', express.static(path.join(__dirname, 'uploads')));
app.use(express.json()); //json 가능
app.use(express.urlencoded({extended:false})); //form 가능
app.use(cookieParser(process.env.COOKIE_SECRET)); //쿠키

const sessionMiddleware = session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie:{
        httpOnly: true,
        secure: false,
    }
});

app.use(sessionMiddleware);
app.use((req, res, next) => {
    if (!req.session.color) {
      const colorHash = new ColorHash();
      req.session.color = colorHash.hex(req.sessionID);
      console.log(req.session.color, req.sessionID);
    }
    next();
  });

app.use('/', indexRouter);

app.use((err, req, res, next)=>{
    res.locals.message = err.message;
    res.locals.err = process.env.NODE_ENV === 'dev' ? err: {} //개발에서만 에러 보이도록
    res.status(err.status || 500);
    res.render('error'); //nunjucks 설정해둬서 이렇게만 해도 views폴더 내의 error.html을 찾아간다.
});

const server = app.listen(app.get('port'), () => {
    console.log('익스프레스 서버 실행');
});

webSocket(server ,app, sessionMiddleware);//app을 넘기는 이유. session에 color를 넣었는데 socket.js에서도 reqsession에 접근하기 위해서.