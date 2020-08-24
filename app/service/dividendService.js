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
    async list(where, page, limit) {
        return await this.ctx.model.Dividend.findAndCountAll({
            where: where,
            offset: page,
            limit: limit,
            order: [['create_time', 'desc'], ['id', 'desc']],
        });
    }
    
    /**
     * 结算投票奖励
     * @returns {Promise<void>}
     */
    async reward() {
        const {app, ctx} = this;
        let node = await ctx.service.nodeBlockService.getAll();
        let voters = await ctx.service.voterService.getAll();

        node.rows.forEach(function (nodeVal, index, nodeKey) {
            voters.rows.forEach(function (voterVal, voterIndex, voterKey) {
                //总票数
                if (voterVal.bp_owner == nodeVal.owner) {
                    ctx.service.voterService.getStakedByBp(nodeVal.owner).then(nodeTotalStaked => {
                        //当前投票用户的占比
                        let vote_proportion = NP.divide(voterVal.staked, nodeTotalStaked).toFixed(4);
                        let vote_reward = NP.times(nodeVal.vote_quantity, vote_proportion).toFixed(10);
                        if (vote_reward >= 1) {
                            let dividend = {
                                id: ctx.helper.createID(),
                                periods_id: nodeVal.periods,
                                owner: voterVal.owner,
                                bp_owner: nodeVal.owner,
                                node_bp_json: JSON.stringify(nodeVal),
                                vote_proportion: vote_proportion,
                                vote_reward: vote_reward,
                                is_reward: false,
                                create_time: ctx.helper.getDate()
                            };
                            ctx.service.dividendService.create(dividend);
                            //app.kue.create('transfer', {id: dividend.id}).ttl(10).save();
                        }
                    });
                }
            });
            ctx.service.nodeBlockService.update(nodeVal.periods, nodeVal.owner, {is_issue: 1});
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

    /**
     * 更新记录
     * @param id
     * @param updates
     * @returns {Promise<boolean|*>}
     */
    async update(id, updates) {
        const dividend = await this.ctx.model.Dividend.findOne({
            where: {
                id: id
            }
        })
        if (!dividend) {
            return false;
        }
        return await dividend.update(updates);
    }

    /**
     * 根据主键获取
     * @param id
     * @returns {Promise<*>}
     */
    async find(id) {
        const voters = await this.ctx.model.Dividend.findByPk(id);
        return voters;
    }
}

module.exports = dividendService;
