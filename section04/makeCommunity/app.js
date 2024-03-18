const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');
const {sequelize} = require('./models');

dotenv.config(); //이 다음 줄 부터 process.env 

const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth')
const passportConfig = require('./passport'); //로그인 시 connect.sid라는 이름으로 세션쿠키가 브라우저로 전송됨.
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');

const app = express();
passportConfig(); //패스포트 설정
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

sequelize.sync({force: false})
    .then(()=>{
        console.log('DB 연결 성공');
    })
    .catch((err) => {
        console.err(err);
    });

app.use(morgan('dev')); //로그찍기
app.use(express.static(path.join(__dirname, 'public'))); //폴더 static으로 변경
app.use('/img',express.static(path.join(__dirname, 'uploads'))); //폴더 static으로 변경
app.use(express.json()); //json 가능
app.use(express.urlencoded({extended:false})); //form 가능
app.use(cookieParser(process.env.COOKIE_SECRET)); //쿠키
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie:{
        httpOnly: true,
        secure: false,
    }
}));
app.use(passport.initialize());//pasport는 반드시 session 밑에
app.use(passport.session());

app.use('/', pageRouter); //라우터 부분
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);

app.use((err, req, res, next)=>{
    res.locals.message = err.message;
    res.locals.err = process.env.NODE_ENV === 'dev' ? err: {} //개발에서만 에러 보이도록
    res.status(err.status || 500);
    res.render('error'); //nunjucks 설정해둬서 이렇게만 해도 views폴더 내의 error.html을 찾아간다.
});

app.listen(app.get('port'), () => {
    console.log('익스프레스 서버 실행');
});