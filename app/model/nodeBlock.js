'use strict';

const moment = require('moment');

/**
 * GAME 配置信息
 * @param app
 * @returns {Model}
 */
module.exports = app => {

    const {STRING, TEXT, BOOLEAN, BIGINT, DATE} = app.Sequelize;

    const nodeBlock = app.model.define('game_node_block', {
        id: {
            type: BIGINT(30),
            primaryKey: true, //主键
            unique: true,//唯一
        },
        periods: BIGINT(20),
        owner: STRING(30),
        total_quantity: STRING(300),
        node_quantity: STRING(300),
        vote_quantity: STRING(300),
        processed_json: TEXT,
        is_issue: BOOLEAN,
        crate_time: {
            type: DATE,
            get() {
                return moment(this.getDataValue('crate_time')).format('YYYY-MM-DD HH:mm:ss');
            }
        }
    });

    return nodeBlock;
};
