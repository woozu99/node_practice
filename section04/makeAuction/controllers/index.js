const { Op } = require('sequelize');
const { Good, User, Auction, sequelize} = require('../models');
const scheduel = require('node-schedule');


exports.renderMain = async (req, res, next) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // 어제 시간
    const goods = await Good.findAll({ 
      where: { SoldId: null, createdAt: { [Op.gte]: yesterday } },
    });
    res.render('main', {
      title: 'NodeAuction',
      goods,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.renderJoin = (req, res) => {
  res.render('join', {
    title: '회원가입 - NodeAuction',
  });
};

exports.renderGood = (req, res) => {
  res.render('good', { title: '상품 등록 - NodeAuction' });
};

exports.createGood = async (req, res, next) => {
  try {
    const { name, price } = req.body;
    const good = await Good.create({
      OwnerId: req.user.id,
      name,
      img: req.file.filename,
      price,
    });
    const end = new Date();
    end.setDate(end.getDate() + 1)//하루 뒤
    
    //스케줄 부분. end에 해당하는 시간이 되면 함수를 실행한다.
    const job = scheduel.scheduleJob(end, async () =>{
        const success = await Auction.findOne({
            where: {GoodId: good.id},
            order: [['bid', 'DESC']],
        });
        await good.setSold(success.UserId);
        await User.update({
            mony: sequelize.literal(`money - ${success.bid}`),
        }, {
            where: {id: success.UserId}
        });
        job.on('error', console.error);
        job.on('success', ()=>{
            console.log(`${good.id} 스케줄링 성공`);
        })
    })
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.renderAuction = async (req, res, next) => {
    
    const [good, auction] = await Promise.all([
        Good.findOne({
            where: {id: req.params.id},
            include: {
                model: User,
                as: 'Owner',
            }
        }),
        Auction.findAll({
            where: {GoodId: req.params.id},
            include: { model: User},
            order: [['bid', 'ASC']]
        })
    ]);
    
    res.render('auction', {
        title: `${good.name} - NodeAcution`,
        good,
        auction,
    })
}

exports.bid = async (req, res, next) => {
    try{
        const {bid, msg} =  req.body;
        const good = await Good.findOne({
            where: {id: req.params.id},
            include: {model: Auction},
            order: [[{model: Auction}, 'bid', 'DESC']]
        });

        if(! good){
            return res.status(404).send('해당상품은 존재하지 않습니다.');
        }

        if(good.price >= bid){
            return res.status(403).send('시작가보다 높게 부르세요.');
        }

        if(new Date(good.createAt).valueOf() + (24*60*60*100) < new Date()){
            return res.status(403).send('종료된 경매입니다.');
        }

        if(good.Auctions?.[0].bid >= bid){
            return res.status(403).send('최종가보다 높게 부르세요.');
        }

        const result = await Auction.create({
            bid,
            msg,
            UserId: req.user.id,
            GoodId: req.params.id,
        });

        req.app.get('io').to(req.params.id).emit('bid', {
            bid: result.bid,
            msg: result.msg,
            nick: req.user.nick,
        });
        return res.send('ok');

    }catch(error){
        console.error(error);
        next(error);
    }
}

exports.renderList = async (req, res, next)=>{
    try {
        const goods = await Good.findAll({
            where: {SoldId: req.user.id},
            include: { model: Auction},
            order: [[{model: Auction}, 'bid', 'DESC']],
        });
        res.render('list', {title: '낙찰목록 - NodeAuction', goods});        
    } catch (error) {
        console.error(error);
        next(error);
    }
}