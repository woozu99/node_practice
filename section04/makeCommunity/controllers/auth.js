const bcypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');

exports.join = async (req, res, next) => {
    const {nick, email, password} = req.body;
    try{
        const exUser = await User.findOne({where:{email}});
        if(exUser){
            return res.redirect('/join?error=exist');
        }

        const hash = await bcypt.hash(password, 12);
        console.log('!!', hash);
        await User.create({email, nick, password: hash});

        return res.redirect('/');
    }catch(err){
        console.error(err);
        next(err);
    }
}

exports.login = (req, res, next) => {
    passport.authenticate('local', (authError, user,info) => { //localStrategy.js에서 쓰는 done함수
        if(authError){
            console.error(authError);
            next(authError);
        }

        if(! user){
            return res.redirect(`/?loginError = ${info.message}`);
        }

        return req.login(user, (loginError) => {
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }

            return res.redirect('/');
        });
    })(req, res, next);
}

exports.logout = (req, res, next) => {
    req.logout(() =>{
        res.redirect('/');
    });
}