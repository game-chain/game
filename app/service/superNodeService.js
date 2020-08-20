'use strict';

const Service = require('egg').Service;

/**
 * @explain game 超级节点信息
 * @author xiaoping
 * @date 2020.3.26
 */
class superNodeService extends Service {

    /**
     * 结算工资
     * @returns {Promise<void>}
     */
    async claimrewards() {
        const {ctx, app} = this;
        const api = await ctx.helper.eosApi();
        let nodes = await ctx.model.SuperNode.findAndCountAll();
        const periods = ctx.helper.createID();
        nodes.rows.forEach(function (node, nodeIndex, nodeKey) {
            api.transact(
                {
                    actions: [{
                        account: 'eosio',
                        name: 'claimrewards',
                        authorization: [{actor: 'gameclaimrel', permission: 'active'}],
                        data: {
                            owner: node.owner
                        },
                    }],
                }, {blocksBehind: 3, expireSeconds: 30}).then(function (result) {
                if (result.code == 200) {
                    console.log(result);
                    let nodeBlock = {
                        periods: periods,
                        owner: result.data.processed.action_traces.act.data.owner,
                        total_quantity: result.data.processed.action_traces.inline_traces[0].act.data.quantity,
                        node_quantity: result.data.processed.action_traces.inline_traces[1].act.data.quantity,
                        vote_quantity: result.data.processed.action_traces.inline_traces[2].act.data.quantity,
                        processed_json: JSON.stringify(result),
                        crate_time: ctx.helper.getDate()
                    };
                    ctx.service.nodeBlockService.create(nodeBlock);
                }
            }).catch(function (e) {
                console.log(e);
            })
        })
    }

    /**
     * 根据名称查询超级节点
     * @param name
     * @returns {Promise<*>}
     */
    async findByName(name) {
        return this.ctx.model.SuperNode.findOne({
            where: {
                owner: name
            }
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
        return await this.ctx.model.SuperNode.findAndCountAll({
            where: where,
            offset: page,
            limit: limit,
            order: [['create_time', 'desc'], ['id', 'desc']],
        });
    }

    /**
     * 获取所有节点
     * @returns {Promise<*>}
     */
    async getAll() {
        return await this.ctx.model.SuperNode.findAndCountAll();
    }

    /**
     * 根据主键获取
     * @param id
     * @returns {Promise<*>}
     */
    async find(id) {
        const voters = await this.ctx.model.SuperNode.findByPk(id);
        if (!voters) {
            this.ctx.throw(404, 'voters not found');
        }
        return voters;
    }

    /**
     * 新增
     * @param superNode
     * @returns {Promise<Voters>}
     */
    async create(superNode) {
        return this.ctx.model.SuperNode.create(superNode);
    }

    /**
     * 更新
     * @param id
     * @param updates
     * @returns {Promise<*>}
     */
    async update({id, updates}) {
        const voters = await this.ctx.model.SuperNode.findByPk(id);
        if (!voters) {
            this.ctx.throw(404, 'user not found');
        }
        return this.ctx.model.SuperNode.update(updates);
    }

    /**
     * 删除
     * @param id
     * @returns {Promise<*>}
     */
    async del(id) {
        const voters = await this.ctx.model.SuperNode.findByPk(id);
        if (voters) {
            return this.ctx.model.SuperNode.destroy();
        }
        return false;
    }

    /**
     * 获取总票数
     * @returns {Promise<void>}
     */
    async getTotalVotes() {
        return await this.ctx.model.SuperNode.sum('total_votes');
    }
}

module.exports = superNodeService;
