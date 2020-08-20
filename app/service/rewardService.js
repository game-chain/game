'use strict';

const Service = require('egg').Service;
const NP = require('number-precision');

/**
 * @explain 奖励服务
 * @author xiaoping
 * @date 2020.3.26
 */
class rewardService extends Service {

    /**
     * 查询配置信息
     * @param name
     * @returns {Promise<*>}
     */
    async transfer(data, done) {
        const {app, ctx} = this;
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
                    "quantity": NP.times(userReward.vote_reward, 10000).toFixed(18),
                    "memo": "voter node bp reward",
                    "tokenType": "GAME",
                    "walletPrivateKey": eosConfig.privateKey
                },
                timeout: 50000
            });

            if (result.data.StatusCode == 200) {
                let transactionJson = result.data;
                let timestamp = result.Timestamp;
                let transactionId = result.data.Data.transaction_id;
                await ctx.service.dividendService.update(data.id, {
                    is_reward: 1,
                    transaction_id: transactionId,
                    transaction_time: ctx.helper.formatToDayTime(timestamp)
                });
                await ctx.service.dividendDetailsService.create({
                    id: ctx.helper.createID(),
                    transaction_id: transactionId,
                    transaction_json: JSON.stringify(transactionJson)
                });
                done();
            }
        } catch (e) {
            ctx.logger.error('处理奖励交易出错：' + e);
        }
    }
}

module.exports = rewardService;
