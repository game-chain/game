'use strict';

const moment = require('moment');

/**
 * GAME EOS表数据
 * @param app
 * @returns {Model}
 */
module.exports = app => {
    const {STRING, BIGINT, DATE, BOOLEAN, INTEGER, TEXT} = app.Sequelize;
    const voters = app.model.define('game_voters', {
        id: {
            type: BIGINT(30),
            primaryKey: true, //主键
            unique: true,//唯一
        },
        node_bp_id: BIGINT(20),
        owner: STRING(100),
        proxy: STRING(100),
        producers: TEXT,
        staked: STRING(200),
        last_vote_weight: STRING(200),
        proxied_vote_weight: STRING(200),
        is_proxy: BOOLEAN,
        flags1: INTEGER.UNSIGNED,
        reserved2: INTEGER,
        reserved3: INTEGER,
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

    return voters;
};
