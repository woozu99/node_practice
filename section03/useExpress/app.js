const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const path = require('path');
const morgan = require('morgan'); //개발 시 응답 어떻게 받았는지 등 확인할 수 있게 해주는 미들웨어
const cookieParser = require('cookie-parser');
const session = require('express-session');
const multer = require("multer");//form data  파일 읽기

const app = express();

app.set('port', process.env.PORT || 3000); //express의 전역변수 설정
//process.env.PORT 전체에서 실행하도록 설정한 포트. 콘솔에서 'SET PORT=80'과 같은 방법으로 설정할 수 있는데 위험하니까 많이 쓰지는 말자

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done){
            done(null, '/upload');
        },
        filename(req,file, done){
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: {fileSize: 5* 1024*1024},
})

//app.use(morgan('dev')); //간단하게
app.use(morgan('combined')); //상세하게.(배포할 때 사용하면 자세하게 에러 알 수 있음.)

app.use(cookieParser());//쿠키파서

app.use(express.json());//req.body.(paramName) 으로 바디 값 바로 가져올 수 있도록 하는 미들웨어
app.use(express.urlencoded({extended: true}));

app.use('/', express.static(path.join(__dirname, 'public'))); //요청경로와 실제경로가 가를 때

app.use(session());

app.use('/', (req,res,next)=>{ //미들웨어 확장
    
    console.log(process.env.SECRET);
    
    if(req.session.id){
        express.static(path.join(__dirname, 'public'))
    }else{
        next();
    }
})



//라우터 가기 전에 처리해주는거.(전체)
app.use((req, res, next) => {
    console.log('모든 요청에 실행하고싶어요.');

    //다른 라우터에 값 전달하기
    req.data = '데이터';

    next();//아래로 읽으면서 해닿하는 라우터에 걸리도록 하는 코드.
});

//라우터 가기 전에 처리해주는거.(특정 URL)
app.use('/hi', (req, res, next) => {
    console.log('특정 요청에 실행하고싶어요.');

    //다른 라우터에서 값 받기
    console.log(req.data);
    next();//아래로 읽으면서 해닿하는 라우터에 걸리도록 하는 코드.
})

app.get('/', (req, res) => {
    req.session.id = "hello";//이 요청을 보낸 사람의 세션에 hello가 담긴다.

    res.send('hello express');
    res.cookies;
    res.cookie('name', encodeURIComponent(name), {
        expires: new Date(),
        httpOnly: true,
        path: '/'
    });
    res.clearCookie('name', encodeURIComponent(name), {
        httpOnly: true,
        path: '/'
    });
});

app.get('/error', (req, res) => {
    throw Error('에러가 남');
});


app.get('/about', upload.single('image')/**이때 여기의  image는 타입이 아니라 넘겨받은 form의 파일태그의 name */, (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
    console.log(req.file);
});

app.get('/routeParam/:urlParam', (req, res) => {
    res.status(404).send(`hello ${req.params.urlParam}`);//기본적으로 결과값은 200을 보내주므로 에러값을 보여주어야 한다.
});

app.get('/errorerror', (req, res, next) => {
    try {
        console.log('에러가 넘어갈까?');
        console.log(sdfs);
    } catch (error) {
        next(error);//바로 에러처리 미들웨어로 보내기;
    }
})

app.get('/json', (req, res) => {
    res.json({'hi': 'hihi'});
    console.log('여기도 들어옵니다.');
});

// app.get('*', (req, res) => {
//     console.log('모든 url 경로에서 실행');
//     res.send('hi');
// });

//404 처리 미들웨어
app.use((req, res, next) => {
    res.send('404에러임');
});

//에러처리(에러미들웨어는 꼭 4가지 파라미터 꼭 들어와야한다.)
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('에러가 났지만 안보여줌');//기본적으로 결과값은 200을 보내주므로 에러값을 보여주어야 한다.(보안을 위해서 일부러 일부 오류는 다른 값을 보여주기도 한다.)
});



app.listen(app.get('port'), () => {
    console.log('익스프레스 서버 실행');
});
