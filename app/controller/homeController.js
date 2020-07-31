'use strict';

const Controller = require('../core/baseController');
const NP = require('number-precision');

class HomeController extends Controller {

    async index() {
        const {ctx, app} = this;
        await ctx.render('index/index.html');
    }

    async test() {

        const {app, ctx} = this;

        let url = 'http://8.210.114.177:8080/nos-iot/v1/noschain/transfer';
        let result = await ctx.curl(url, {
            method: "POST",
            dataType: "json",
            headers: {
                "content-type": "application/json"
            },
            data: {
                "from": "gamevpay1111",
                "to": "gamebp2",
                "quantity": 10000,
                "memo": "game test",
                "tokenType": "GAME",
                "walletPrivateKey": "5JwUB7v5Fsd8KStZS5hzQTaUuDZAntuXQp5hb39FHcgd2ndFHa8"
            },
            timeout: 50000
        });

        this.success(result);

        // NP.strip(0.09999999999999998); // = 0.1
        // NP.plus(0.1, 0.2);             // = 0.3, not 0.30000000000000004
        // NP.plus(2.3, 2.4);             // = 4.7, not 4.699999999999999
        // NP.minus(1.0, 0.9);            // = 0.1, not 0.09999999999999998
        // NP.times(3, 0.3);              // = 0.9, not 0.8999999999999999
        // NP.times(0.362, 100);          // = 36.2, not 36.199999999999996
        // NP.divide(1.21, 1.1);          // = 1.1, not 1.0999999999999999
        // NP.round(0.105, 2);            // = 0.11, not 0.1
        // this.success(NP.plus(0.1, 0.2));

        await this.ctx.service.dividendService.reward();
        this.success();
        // get
        //this.success(await this.app.redis.hgetall("game:schedule:status"));
        // const {app, ctx} = this;
        // // 在需要的地方订阅一个消息
        // for (let index = 1; index <= 1000; index++) {
        //     app.kue.create('transfer', {
        //         number: index
        //         , to: 'gdjyluxiaoyong@gmail.com'
        //         , template: 'welcome-email'
        //     }).ttl(10).save();
        // }
    }

    async tran() {

        /**
         * 自动进行事务管理
         */
        const result = await this.app.mysql.beginTransactionScope(async conn => {
            const result = await conn.insert('tz_currency',
                {
                    id: this.ctx.helper.createID(),
                    cname: 'BTC',
                    nickname: '比特币',
                    is_forbidden: false,
                    create_time: this.ctx.helper.getDate()
                });
            return {success: result.affectedRows === 1};
        }, this.ctx);
        this.success(result);
    }
}

module.exports = HomeController;
