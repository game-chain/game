'use strict';

const Service = require('egg').Service;

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
        ctx.service.dividendService.update(data.id, {
            is_reward: 1
        });
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
        done();
    }
}

module.exports = rewardService;
