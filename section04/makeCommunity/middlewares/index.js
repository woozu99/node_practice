exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {//passport통해서 로그인 했는가?
        console.log('로그인 체크:로그인 한 상태');
        next();
    } else{
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        console.log('로그인 체크:로그인 안한 상태');
        next();
    } else{
        const message = encodeURIComponent('로그인한 상태입니다.');
        res.redirect(`/?error=${message}`);//localhodt:8001?에러메시지
    }
}