const Post = require('../models/post');
const Hashtag = require('../models/hashtag');

exports.afterUploadImage = (req, res) => {
    console.log(req.file);
    res.json({url: `/img/${req.file.filename}`});
}

exports.uploadPost = async (req, res, next) => {
    //화면에서 넘긴 값 req.body.content, req.body.url 사용 가능
    console.log('여기까지 들어옴');

    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            UserId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s#]*/g);  //해시태그 정규표현식

        if(hashtags){
            const result = await Promise.all(hashtags.map((tag) => {
                return Hashtag.findOrCreate({
                    where: {title: tag.slice(1).toLowerCase()}
                });
            }));

            console.log(result);
            await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');
    }catch(err){
        console.error(err);
        next(err);
    }
}