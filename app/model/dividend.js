'use strict';

const moment = require('moment');

/**
 * GAME 配置信息
 * @param app
 * @returns {Model}
 */
module.exports = app => {

    const {STRING, TEXT, BOOLEAN, BIGINT, DATE, DECIMAL} = app.Sequelize;

    const dividend = app.model.define('game_dividend', {
        id: {
            type: BIGINT(30),
            primaryKey: true, //主键
            unique: true,//唯一
        },
        periods_id: BIGINT(30),
        owner: STRING(100),
        node_bp_id: BIGINT(30),
        node_bp_json: TEXT,
        vote_proportion: DECIMAL(12, 10),
        vote_reward: DECIMAL(12, 10),
        is_reward: BOOLEAN,
        create_time: {
            type: DATE,
            get() {
                return moment(this.getDataValue('create_time')).format('YYYY-MM-DD HH:mm:ss');
            }
        }
    });
    
    return dividend;
};
