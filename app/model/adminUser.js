'use strict';

const moment = require('moment');

/**
 * GAME 配置信息
 * @param app
 * @returns {Model}
 */
module.exports = app => {

    const {STRING, TEXT, BOOLEAN, BIGINT, DATE} = app.Sequelize;

    const adminUser = app.model.define('game_admin_user', {
        id: {
            type: BIGINT(30),
            primaryKey: true, //主键
            unique: true,//唯一
        },
        name: STRING(100),
        password: STRING(300),
        rule_group: TEXT,
        introduction: STRING(300),
        avatar: STRING(300),
        google_secret: STRING(300),
        is_del: BOOLEAN,
        could_not_del: BOOLEAN,
        add_time: {
            type: DATE,
            get() {
                return moment(this.getDataValue('add_time')).format('YYYY-MM-DD HH:mm:ss');
            }
        }
    });

    return adminUser;
};
