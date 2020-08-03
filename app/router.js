'use strict';

/**
 * 全局路由文件
 *
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {

    const {router, controller} = app;
    //组装路由中间件所需参数
    const apiAuth = app.middleware.auth({router: app.config.router, jwt: app.jwt, secret: app.config.jwt.secret});
    const adminAuth = app.middleware.request({router: app.config.router});

    router.post('/v1/auth', controller.jwtController.login);
    router.post('/login', controller.userController.login);

    router.get('/', adminAuth, controller.homeController.index);
    router.get('/node', adminAuth, controller.eosController.node);
    router.get('/voters', adminAuth, controller.eosController.voters);
    router.get('/dividend', adminAuth, controller.dividendController.dividend);
    router.get('/outLogin', adminAuth, controller.userController.outLogin);
    router.get('/vote', apiAuth, controller.voteRecordingController.vote);

    //同步投票信息
    router.post('/synchronizeCollection', adminAuth, controller.eosController.synchronizeCollection);
    //同步超级节点信息
    router.post('/synchronizeSuperNode', adminAuth, controller.eosController.synchronizeSuperNode);
    // 修改周期
    router.post('/cycle', adminAuth, controller.eosController.cycle);


    //用户奖励总额
    router.post('/owner/amount', apiAuth, controller.dividendController.getAmount);
    router.post('/owner/details', apiAuth, controller.dividendController.getDetails);

    //用户提交投票
    router.post('/vote', apiAuth, controller.voteRecordingController.submitVote);
    //获取提交投票纪录
    router.post('/vote/details', apiAuth, controller.voteRecordingController.getDetails);


    //弃用
    router.get('/test', controller.homeController.test);
    //EOS
    router.post('/eos/v1/info', controller.eosController.info);
    router.post('/eos/v1/block', controller.eosController.block);
    router.post('/eos/v1/table', controller.eosController.getTable);
    router.post('/eos/v1/del', controller.eosController.del);
    router.post('/eos/v1/random', controller.eosController.random);
    router.post('/eos/v1/account', controller.eosController.getAccount);
    router.post('/eos/v1/balance', controller.eosController.getBalance);
    router.post('/eos/v1/actions', controller.eosController.getActions);
    router.post('/eos/v1/createKey', controller.eosController.createKey);
    router.post('/eos/v1/createAccount', controller.eosController.createAccount);
    router.post('/eos/v1/transfer', controller.eosController.transfer);
    router.post('/eos/v1/buyRam', controller.eosController.buyRam);
    router.post('/eos/v1/mortgage', controller.eosController.mortgage);
};
