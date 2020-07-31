'use strict';

const Service = require('egg').Service;

/**
 * @explain 奖励服务
 * @author xiaoping
 * @date 2020.3.26
 */
class rewardService extends Service {

    /**
     * 查询配置信息
     * @param name
     * @returns {Promise<*>}
     */
    async transfer(data, done) {
        console.log('队列消息编号:' + data.number);
        //console.log('收到消息队列信息:' + data + '' + param);
        done();
    }
    
}

module.exports = rewardService;
