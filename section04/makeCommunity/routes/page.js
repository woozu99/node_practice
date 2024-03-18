const express = require("express");
const router = express.Router();
const {isLoggedIn, isNotLoggedIn} = require('../middlewares');

const {renderJoin, renderMain, renderProfile, renderHashtag} = require('../controllers/page.js');

router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.followerCount = req.user?.Followers.length || 0;
    res.locals.followingCount = req.user?.Followings.length || 0;
    res.locals.followingIdList = req.user?.Followings.map(f => f.id) || [];
    next();
});

router.get('/profile', isLoggedIn, renderProfile);
router.get('/join', isNotLoggedIn, renderJoin);
router.get('/', renderMain);
router.get('/hashtag', renderHashtag); //hashtag?hashtag=고양이

module.exports = router;