'use strict';

const moment = require('moment');

/**
 * GAME 配置信息
 * @param app
 * @returns {Model}
 */
module.exports = app => {

    const {STRING, TEXT, BIGINT} = app.Sequelize;

    const dividendDetails = app.model.define('game_dividend', {
        id: {
            type: BIGINT(30),
            primaryKey: true, //主键
            unique: true,//唯一
        },
        transaction_id: STRING(300),
        transaction_json: TEXT,
    });

    return dividendDetails;
};
