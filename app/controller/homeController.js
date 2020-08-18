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
        let url = 'http://8.210.114.177:8080/nos-iot/v1/noschain/getTotalNodes';
        let result = await ctx.curl(url, {
            method: "GET",
            dataType: "json",
            headers: {
                "content-type": "application/json"
            },
            timeout: 50000
        });
        result.data.Data.forEach(function (bp, bpIndex, bpKey) {
            console.log(bp['owner']);
        });
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
