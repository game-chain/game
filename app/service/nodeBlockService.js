'use strict';

const Service = require('egg').Service;

/**
 * @explain 出块结算
 * @author xiaoping
 * @date 2020.3.26
 */
class nodeBlockService extends Service {


    /**
     * 查询单个节点出块工资
     * @param name
     * @returns {Promise<*>}
     */
    async findByName(name) {
        return this.ctx.model.NodeBlock.findOne({
            where: {
                owner: name
            }
        });
    }

    /**
     * 所有超级节点出块工资
     * @param offset
     * @param limit
     * @param where
     * @returns {Promise<*>}
     */
    async list(where, page, limit) {
        return this.ctx.model.NodeBlock.findAndCountAll({
            where: where,
            offset: page,
            limit: limit,
            order: [['create_time', 'desc'], ['id', 'desc']],
        });
    }

    /**
     * 所有未发放的奖励
     * @param where
     * @param offset
     * @param limit
     * @returns {Promise<*>}
     */
    async getAll() {
        return this.ctx.model.NodeBlock.findAndCountAll(
            {
                where: {
                    'is_issue': 0
                }
            }
        );
    }

    /**
     * 根据主键获取
     * @param id
     * @returns {Promise<*>}
     */
    async find(id) {
        const voters = await this.ctx.model.NodeBlock.findByPk(id);
        if (!voters) {
            this.ctx.throw(404, 'voters not found');
        }
        return voters;
    }

    /**
     * 新增
     * @param voters
     * @returns {Promise<Voters>}
     */
    async create(voters) {
        return this.ctx.model.NodeBlock.create(voters);
    }

    /**
     * 更新
     * @param owner
     * @param updates
     * @returns {Promise<*>}
     */
    async update(periods, owner, updates) {
        const voters = await this.ctx.model.NodeBlock.findOne({
            owner: owner,
            periods: periods
        });
        if (!voters) {
            return false;
        }
        return voters.update(updates);
    }

    /**
     * 删除
     * @param id
     * @returns {Promise<*>}
     */
    async del(id) {
        const voters = await this.ctx.model.NodeBlock.findByPk(id);
        if (!voters) {
            this.ctx.throw(404, 'voters not found');
        }
        return Voters.destroy();
    }

    /**
     * @param owner
     * @returns {Promise<*>}
     */
    async getCount(owner) {
        return await this.ctx.model.NodeBlock.count({
            owner: owner
        });
    }
}

module.exports = nodeBlockService;
