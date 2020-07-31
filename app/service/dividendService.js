'use strict';

const Service = require('egg').Service;

/**
 * @explain 奖励服务
 * @author xiaoping
 * @date 2020.3.26
 */
class dividendService extends Service {

    /**
     * 查询用户投票总收益
     * @param name
     * @returns {Promise<*>}
     */
    async getOwnerTotalAmount(owner) {
        const {app, ctx} = this;
        let userAmount = await ctx.model.Dividend.sum('vote_reward', {where: {owner: owner}});
        return userAmount;
    }

    /**
     * 查询奖励详情
     * @param owner
     * @param page
     * @param limit
     * @returns {Promise<void>}
     */
    async getDetails(owner, page = 1, limit = 10) {
        const {app, ctx} = this;
        let offset = page <= 0 ? 1 : page;
        limit = limit > 100 || limit <= 100 ? 20 : limit;
        offset = (offset - 1) * limit;
        return await ctx.model.Dividend.findAndCountAll({
            where: {owner: owner},
            offset: offset, limit: limit
        });
    }
}

module.exports = dividendService;
