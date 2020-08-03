'use strict';

const moment = require('moment');

/**
 * GAME 配置信息
 * @param app
 * @returns {Model}
 */
module.exports = app => {

    const {STRING, BIGINT} = app.Sequelize;
    
    const nodeInfo = app.model.define('game_node_info', {
        id: {
            type: BIGINT(20),
            primaryKey: true, //主键
            unique: true,//唯一
        },
        bp_name: {
            type: STRING(200),
            unique: true,//唯一
        },
        icon: STRING(200)
    });

    return nodeInfo;
};
