//파일 올리는 라우터
const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const {afterUploadImage, uploadPost} = require('../controllers/post');


//업로드 폴더
try{
    fs.readdirSync('uploads'); //폴더 없으면 에러.
} catch (err){
    fs.mkdirSync('uploads'); //폴더 만들기
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb){
            cb(null, 'uploads/');
        },
        filename(req, file, cb){
            const ext = path.extname(file.originalname); //확장자
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        }
    }),
    limits: {fileSize: 5 * 1024 * 1024},
});

const {isLoggedIn, isNotLoggedIn} = require('../middlewares');

router.post('/img', isLoggedIn, upload.single('img'), afterUploadImage);

const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), uploadPost);

module.exports = router;