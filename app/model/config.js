'use strict';

const moment = require('moment');

/**
 * GAME 配置信息
 * @param app
 * @returns {Model}
 */
module.exports = app => {

    const {STRING, TEXT} = app.Sequelize;

    const config = app.model.define('game_config', {
        k: {
            type: STRING(30),
            primaryKey: true, //主键
            unique: true,//唯一
        },
        v: STRING(100),
        module: TEXT,
        remark: STRING(200)
    });

    return config;
};
