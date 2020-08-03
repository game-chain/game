'use strict';

const moment = require('moment');

/**
 * GAME 配置信息
 * @param app
 * @returns {Model}
 */
module.exports = app => {

    const {STRING, BIGINT, DATE, DECIMAL} = app.Sequelize;

    const voteRecording = app.model.define('game_vote_recording', {
        id: {
            type: BIGINT(30),
            primaryKey: true, //主键
            unique: true,//唯一
        },
        owner: STRING(100),
        bp_name: STRING(100),
        ticket: DECIMAL(20, 10),
        create_time: {
            type: DATE,
            get() {
                return moment(this.getDataValue('create_time')).format('YYYY-MM-DD HH:mm:ss');
            }
        }
    });

    return voteRecording;
};
