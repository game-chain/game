'use strict';

const moment = require('moment');

/**
 * GAME EOS表数据
 * @param app
 * @returns {Model}
 */
module.exports = app => {
    const {STRING, BIGINT, DATE, BOOLEAN, INTEGER, TEXT} = app.Sequelize;
    const superNode = app.model.define('game_super_node', {
        id: {
            type: BIGINT(30),
            primaryKey: true, //主键
            unique: true,//唯一
        },
        is_active: BOOLEAN,
        location: STRING(100),
        owner: STRING(100),
        producer_authority: TEXT,
        producer_key: STRING(200),
        total_votes: STRING(200),
        unpaid_blocks: INTEGER,
        url: STRING(200),
        last_claim_time: {
            type: DATE,
            get() {
                return moment(this.getDataValue('last_claim_time')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        create_time: {
            type: DATE,
            get() {
                return moment(this.getDataValue('create_time')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        update_time: {
            type: DATE,
            get() {
                return moment(this.getDataValue('update_time')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
    });

    return superNode;
};
