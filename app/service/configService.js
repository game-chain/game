'use strict';

const Service = require('egg').Service;

/**
 * @explain 配置文件
 * @author xiaoping
 * @date 2020.3.26
 */
class configService extends Service {
    
    /**
     * 查询配置信息
     * @param name
     * @returns {Promise<*>}
     */
    async getValueByKey(key) {
        return await this.ctx.model.Config.findOne({
            attributes: ['v'],
            where: {
                k: key
            }
        });
    }

    /**
     * 更新
     * @param id
     * @param updates
     * @returns {Promise<*>}
     */
    async update(key, updates) {
        const config = await this.ctx.model.Config.findOne({
            where: {
                k: key
            }
        })
        if (!config) {
            return false;
        }
        return await config.update(updates);
    }
}

module.exports = configService;
