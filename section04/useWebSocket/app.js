const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

dotenv.config();//dotenv 사용 설정

const webSocket = require('./socket');//웹소켓 설정

const indexRouter = require('./routers');

const app = express();

app.set('port', process.env.PORT || 8005);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

app.use('/', indexRouter);

const server = app.listen(app.get('port'), ()=>{ //!여기서 가져온 서버를
    console.log('익스프레스 서버 실행!');
});

//!여기에서 웹소켓과 연결한다.
webSocket(server);
