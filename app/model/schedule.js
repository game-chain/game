'use strict';

const moment = require('moment');

/**
 * GAME 配置信息
 * @param app
 * @returns {Model}
 */
module.exports = app => {

    const {STRING, TEXT, BOOLEAN, BIGINT, DATE} = app.Sequelize;

    const schedule = app.model.define('game_schedule', {
        id: {
            type: BIGINT(30),
            primaryKey: true, //主键
            unique: true,//唯一
        },
        schedule_name: STRING(50),
        cron: STRING(100),
        fun: STRING(200),
        switch: BOOLEAN,
        cfg: TEXT,
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

    return schedule;
};
