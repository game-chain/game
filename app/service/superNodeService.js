'use strict';

const Service = require('egg').Service;

/**
 * @explain game 超级节点信息
 * @author xiaoping
 * @date 2020.3.26
 */
class superNodeService extends Service {

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
    async list(where, {offset = 0, limit = 10}) {
        return await this.ctx.model.SuperNode.findAndCountAll({
            where: where,
            offset,
            limit,
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
        if (!voters) {
            this.ctx.throw(404, 'voters not found');
        }
        return this.ctx.model.SuperNode.destroy();
    }
}

module.exports = superNodeService;
