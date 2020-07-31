'use strict';

/**
 * 本地测试环境系统配置
 *
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {

    /**
     * csrf post参数校验关闭
     * @type {{security: {csrf: {enable: boolean}}}}
     */
    const config = {
        security: {
            csrf: {
                enable: false,//关闭csrf安全验证
            },
        }
    };

    /**
     * cookie签名密钥
     *
     * @type {string}
     */
    config.keys = appInfo.name + '_1578555800633_4297';

    /**
     * 自定义配置
     *
     * @type {{appName: string, author: string, version: string}}
     */
    config.systems = {
        key: 'sbihgu',//数据加密key
        appName: 'game',
        version: '1.0.0',
        author: 'sbihgu',
    };

    /**
     * eos配置中心
     *
     * @type {{privateKey: string, random: string, scope: string, rpcUrl: string, account: string, table: string}}
     */
    config.eos = {
        account: 'sbihgutest11',
        privateKey: '5J6R3MsgyTqid2TYudmpX33MUCwLc4ddH421HYkPK3NjZMTmpM6',
        rpcUrl: 'http://8.210.114.177:8888',
        table: 'voters',
        scope: 'eosio',
        code: 'eosio',
        gameApi: 'http://8.210.114.177:8080/'
    };

    /**
     * 无需jwt身份验证路由
     *
     * @type {*[]} 放行的路由数组
     */
    config.router = [
        '/login',
        '/test',
    ];

    /**
     * jwt配置信息
     *
     * @type {{expires: string, secret: string}}
     */
    config.jwt = {
        secret: "123456",
        expires: '1d'
    };

    /**
     * ORM 配置
     * @type {{password: string, database: string, dialect: string, port: number, host: string, username: string}}
     */
    config.sequelize = {
        dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
        database: 'game',
        host: '127.0.0.1',
        username: "root",
        password: "123456",
        port: 3306,
        timezone: '+08:00',// 设置东8区, 单单设置这个的话只有写有效**
        dialectOptions: { // 添加这个后，读取的才是设置的timezone时区时间。
            typeCast(field, next) {
                if (field.type === 'DATETIME' || field.type === 'TIMESTAMP' || field.type === 'DATE') {
                    return new Date(field.string());
                }
                return next();
            },
        },
        // 个性化配置
        define: {
            // 取消数据表名复数
            freezeTableName: true,
            // 禁止自动写入时间戳 created_at updated_at
            timestamps: false,
            // 字段生成软删除时间戳 deleted_at
            paranoid: false,
            //驼峰命名法
            underscored: false
        },
        pool: { // 连接池
            max: 10,
            min: 1,
            idle: 10000,
        },
        retry: {max: 3},
    };

    /**
     * redis配置
     * @type {{client: {password: string, port: number, host: string, db: number}}}
     */
    config.redis = {
        client: {
            port: 6379,          // Redis port
            host: '127.0.0.1',   // Redis host
            password: '',
            db: 0
        }
    };

    /**
     * 消息队列配置
     * @type {{client: {queuePrefix: string, redis: {port: number, auth: string, host: string, options: {}, db: number}}}}
     */
    config.kue = {
        app: true,
        agent: false,
        client: {
            queuePrefix: 'game_queue',
            redis: {
                port: 6379,
                host: '127.0.0.1',
                auth: '',
                db: 2,
                // see https://github.com/mranney/node_redis#rediscreateclient
                options: {},
            },
        },
    };

    /**
     * 动态任务初始化配置
     * https://github.com/shudingbo/egg-schex
     * @type {{client: {checkInterval: number, port: number, jobInitCfg: string, host: string, keyPre: string, db: number}}}
     */
    config.schex = {
        client: {
            port: 6379,
            host: '127.0.0.1',
            db: 0,
            keyPre: 'game:schedule',
            checkInterval: 5000,
            jobInitCfg: 'schedule.json',
        },
    };

    /**
     * 插件配置
     * @type {{defaultViewEngine: string, mapping: {".html": string}}}
     */
    config.view = {
        defaultViewEngine: 'nunjucks',
        mapping: {
            '.html': 'nunjucks', //模板后缀为配置成.html
        },
    }

    /**
     * 404
     * @type {{pageUrl: string}}
     */
    config.notfound = {
        pageUrl: 'error/500.html',
    }


    /**
     * 应用中间件配置
     *
     * @type {*[]}
     */
    //config.middleware = ['request'];

    return {
        ...config,
    };

};
