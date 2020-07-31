'use strict';

const Service = require('egg').Service;
const NP = require('number-precision');

/**
 * @explain 奖励服务详情
 * @author xiaoping
 * @date 2020.3.26
 */
class dividendDetailsService extends Service {

    /**
     * 新增
     * @param details
     * @returns {Promise<Voters>}
     */
    async create(details) {
        return await this.ctx.model.DividendDetails.create(details);
    }
}

module.exports = dividendDetailsService;
