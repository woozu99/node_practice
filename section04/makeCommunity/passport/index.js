const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
    //세션에 {세션쿠키: 유저아이디} 형태로 저장

    passport.deserializeUser((id, done) => {
        User.findOne({
            where: { id },
            include: [{model: User, attributes: ['id', 'nick'], as: 'Followers'},{model: User, attributes: ['id', 'nick'], as: 'Followings'}] }
          )
          .then(user => done(null, user))//req.user 복원. 이때 req.session도 같이 생겨서 session을 사용할 수 있도록 함.
          .catch(err => done(err));
      });

    local();
    kakao();
}