'use strict';

const Service = require('egg').Service;

/**
 * @explain 定时任务配置
 * @author xiaoping
 * @date 2020.3.26
 */
class scheduleService extends Service {

    /**
     * 查询配置信息
     * @param name
     * @returns {Promise<*>}
     */
    async list() {
        return await this.ctx.model.Schedule.findAll();
    }
    
    /**
     * 组装成json
     * @returns {Promise<void>}
     */
    async readJson() {
        let list = await this.list();
        let data = [];
        list.forEach(function (val, index, key) {
            let temp = {};
            let keys = val.schedule_name;
            temp[keys] = {
                base: {
                    cron: val.cron,
                    fun: val.fun,
                    switch: val.switch
                },
                cfg: val.cfg
            };
            data.push(temp);
        });
        return data;
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

module.exports = scheduleService;
