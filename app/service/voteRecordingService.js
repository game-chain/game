'use strict';

const Service = require('egg').Service;
const NP = require('number-precision');

/**
 * @explain 投票记录
 * @author xiaoping
 * @date 2020.3.26
 */
class voteRecordingService extends Service {

    /**
     * 查询投票记录
     * @param owner
     * @param page
     * @param limit
     * @returns {Promise<void>}
     */
    async getList(owner, page, limit) {
        const {app, ctx} = this;
        let offset = page <= 0 ? 1 : page;
        limit = limit > 100 || limit <= 0 ? 10 : limit;
        offset = (offset - 1) * limit;
        return await ctx.model.VoteRecording.findAndCountAll({
            where: {owner: owner},
            offset: offset, limit: limit
        });
    }

    /**
     * 创建新的一笔奖励
     * @param dividend
     * @returns {Promise<void>}
     */
    async create(owner, bp_name, ticket) {
        const {ctx} = this;
        return await this.ctx.model.VoteRecording.create({
            id: ctx.helper.createID(),
            owner: owner,
            bp_name: bp_name,
            ticket: ticket,
            create_time: ctx.helper.getDate()
        });
    }

    /**
     * 投票记录
     * @param offset
     * @param limit
     * @param where
     * @returns {Promise<*>}
     */
    async list(where, page, limit) {
        return await this.ctx.model.VoteRecording.findAndCountAll({
            where: where,
            offset: page,
            limit: limit,
            order: [['create_time', 'desc'], ['id', 'desc']],
        });
    }
}

module.exports = voteRecordingService;
