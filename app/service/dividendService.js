'use strict';

const Service = require('egg').Service;
const NP = require('number-precision');

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

    /**
     * 列出所有超级节点
     * @param offset
     * @param limit
     * @param where
     * @returns {Promise<*>}
     */
    async list(where, {offset = 0, limit = 10}) {
        return await this.ctx.model.Dividend.findAndCountAll({
            where: where,
            order: [['create_time', 'desc'], ['id', 'desc']],
        });
    }

    /**
     * 结算投票奖励
     * @returns {Promise<void>}
     */
    async reward() {
        const {app, ctx} = this;

        ctx.logger.info('开始结算用户投票奖励：')

        let node = await ctx.service.superNodeService.getAll();
        let voters = await ctx.service.voterService.getAll();

        //期数
        const periodsId = ctx.helper.createID();

        voters.rows.forEach(function (voterVal, voterIndex, voterKey) {
            ctx.logger.info('结算用户：' + voterVal.owner);

            node.rows.forEach(function (nodeVal, index, nodeKey) {

                if (voterVal.node_bp_id == nodeVal.id) {

                    //当前投票用户的占比
                    let vote_proportion = NP.divide(nodeVal.total_votes, voterVal.staked);
                    //超级节点只拿出80%来奖励给投票用户
                    let totalReward = NP.times(vote_proportion, 0.8).toFixed(10);
                    //根据所投票占比计算奖励
                    let vote_reward = NP.times(totalReward, nodeVal.location).toFixed(10);

                    if (vote_reward > 0) {

                        let dividend = {
                            id: ctx.helper.createID(),
                            periods_id: periodsId,
                            owner: voterVal.owner,
                            node_bp_id: nodeVal.id,
                            node_bp_json: JSON.stringify(nodeVal),
                            vote_proportion: vote_proportion,
                            vote_reward: vote_reward,
                            is_reward: false,
                            create_time: ctx.helper.getDate()
                        };

                        ctx.service.dividendService.create(dividend);

                        app.kue.create('transfer', {id: dividend.id}).ttl(10).save();

                    }
                }
                return;
            });
        });
    }

    /**
     * 创建新的一笔奖励
     * @param dividend
     * @returns {Promise<void>}
     */
    async create(dividend) {
        return await this.ctx.model.Dividend.create(dividend);
    }
}

module.exports = dividendService;
