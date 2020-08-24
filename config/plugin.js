'use strict';

// 插件配置

/**
 * 开启验证参数插件
 *
 * @type {{package: string, enable: boolean}}
 */
exports.validate = {
    enable: true,
    package: 'egg-validate',
};

/**
 * jwt授权验证
 *
 * @type {{package: string, enable: boolean}}
 */
exports.jwt = {
    enable: true,
    package: 'egg-jwt',
};


/**
 * redis插件
 * @type {{package: string, enable: boolean}}
 */
exports.redis = {
    enable: true,
    package: 'egg-redis',
};


/**
 * ORM
 * @type {{package: string, enable: boolean}}
 */
exports.sequelize = {
    enable: true,
    package: 'egg-sequelize',
};

/**
 * 模板插件
 * @type {{package: string, enable: boolean}}
 */
exports.nunjucks = {
    enable: true,
    package: 'egg-view-nunjucks',
};

/**
 * 队列
 * @type {{package: string, enable: boolean}}
 */
exports.kue = {
    enable: false,
    package: 'egg-kue',
};

/**
 * 定时任务动态配置扩展
 * @type {{package: string, enable: boolean}}
 */
exports.schex = {
    enable: true,
    package: 'egg-schex',
};




