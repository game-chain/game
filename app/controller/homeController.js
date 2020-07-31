'use strict';

const Controller = require('../core/baseController');

class HomeController extends Controller {

    async index() {
        const {ctx, app} = this;
        await ctx.render('index/index.html');
    }

    async test() {
        const {app, ctx} = this;
        // 在需要的地方订阅一个消息
        for (let index = 1; index <= 1000; index++) {
            app.kue.create('transfer', {
                number: index
                , to: 'gdjyluxiaoyong@gmail.com'
                , template: 'welcome-email'
            }).ttl(10).save();
        }

        this.success();
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
