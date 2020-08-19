'use strict';

const Service = require('egg').Service;

/**
 * @explain game eos 表数据
 * @author xiaoping
 * @date 2020.3.26
 */
class voterService extends Service {

    /**
     * 查询当个投票用户
     * @param name
     * @returns {Promise<*>}
     */
    async findByName(name) {
        return await this.ctx.model.Voters.findOne({
            where: {
                owner: name
            }
        });
    }

    /**
     * 所有投票用户
     * @param offset
     * @param limit
     * @param where
     * @returns {Promise<*>}
     */
    async list(where, page, limit) {
        return this.ctx.model.Voters.findAndCountAll({
            where: where,
            offset: page,
            limit: limit,
            order: [['create_time', 'desc'], ['id', 'desc']],
        });
    }

    /**
     * 所有投票用户
     * @param where
     * @param offset
     * @param limit
     * @returns {Promise<*>}
     */
    async getAll() {
        return this.ctx.model.Voters.findAndCountAll();
    }

    /**
     * 根据主键获取
     * @param id
     * @returns {Promise<*>}
     */
    async find(id) {
        const voters = await this.ctx.model.Voters.findByPk(id);
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
        const {ctx} = this;
        let result = await this.findByName(voters.owner);
        if (!result) {
            return await ctx.model.Voters.create(voters);
        } else {
            delete voters.id;
            delete voters.create_time;
            result.update(voters);
        }
    }

    /**
     * 更新
     * @param owner
     * @param updates
     * @returns {Promise<*>}
     */
    async update(owner, updates) {
        const voters = await this.ctx.model.Voters.findOne({
            owner: owner
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
        const voters = await this.ctx.model.Voters.findByPk(id);
        if (!voters) {
            this.ctx.throw(404, 'voters not found');
        }
        return Voters.destroy();
    }

    /**
     *
     * @param owner
     * @returns {Promise<*>}
     */
    async getCount(owner) {
        return await this.ctx.model.Voters.count({
            owner: owner
        });
    }

    /**
     * 总票数
     * @param bpId
     * @returns {Promise<*>}
     */
    async getStakedByBp(owner) {
        return await this.ctx.model.Voters.sum('staked', {
            where: {
                bp_owner: owner
            }
        });
    }
}

module.exports = voterService;
