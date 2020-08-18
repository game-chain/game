'use strict';

const Controller = require('../core/baseController');
const NP = require('number-precision');

class HomeController extends Controller {

    async index() {
        const {ctx, app} = this;
        await ctx.render('index/index.html');
    }

    async test() {
        let data = {};
        data.id = '5461433269880111458';
        const {ctx, app} = this;
        ctx.logger.info('处理奖励编号:' + data.id);
        try {
            let userReward = await ctx.service.dividendService.find(data.id);
            if (!userReward) {
                return;
            }
            if (userReward.is_reward) {
                return;
            }

            let eosConfig = app.config.eos;
            let url = eosConfig.gameApi + 'nos-iot/v1/noschain/transfer';
            let result = await ctx.curl(url, {
                method: "POST",
                dataType: "json",
                headers: {
                    "content-type": "application/json"
                },
                data: {
                    "from": eosConfig.account,
                    "to": userReward.owner,
                    //NP.times(userReward.vote_reward, 10000).toFixed(18)
                    "quantity": 1,
                    "memo": "节点投票奖励",
                    "tokenType": "GAME",
                    "walletPrivateKey": eosConfig.privateKey
                },
                timeout: 50000
            });
            console.log(result);
            if (result.data.StatusCode == 200) {
                let transactionJson = result.data;
                let timestamp = result.Timestamp;
                let transactionId = result.data.Data.transaction_id;
                await ctx.service.dividendService.update(data.id, {
                    is_reward: 1,
                    transaction_id: transactionId,
                    //transaction_time: ctx.helper.formatToDayTime(timestamp)
                    transaction_time: ctx.helper.getDate()
                });

                await ctx.service.dividendDetailsService.create({
                    id: ctx.helper.createID(),
                    transaction_id: transactionId,
                    transaction_json: JSON.stringify(transactionJson)
                });

            }
            this.success();
        } catch (e) {
            ctx.logger.error('处理奖励交易出错：' + e);
        }
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
