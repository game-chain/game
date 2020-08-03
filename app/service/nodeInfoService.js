'use strict';

const Service = require('egg').Service;

/**
 * @explain 配置文件
 * @author xiaoping
 * @date 2020.3.26
 */
class nodeInfoService extends Service {

    /**
     * 更新信息
     * @param bp_name
     * @param updates
     * @returns {Promise<*>}
     */
    async update(bp_name, updates) {
        let config = await this.ctx.model.NodeInfo.findOne({
            where: {
                bp_name: bp_name
            }
        })
        if (!config) {
            config = await this.ctx.model.NodeInfo.create({
                id: this.ctx.helper.createID(),
                bp_name: bp_name
            });
        }
        return await config.update(updates);
    }

    /**
     * 获取基本信息
     * @param bp_name
     * @returns {Promise<*>}
     */
    async getInfo(bp_name) {
        let nodeInfo = this.ctx.model.NodeInfo.findOne({
            where: {
                bp_name: bp_name
            }
        });
        return nodeInfo;
    }
}

module.exports = nodeInfoService;
