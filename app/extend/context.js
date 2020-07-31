'use strict';

/**
 * 定义常用常量
 * @type {{SUCCESS_CODE: number, FAIL_CODE: number, XRP_BALANCE_CHANGE: string}}
 */
module.exports = {
    //成功
    SUCCESS_CODE: 200,
    //失败
    FAIL_CODE: 500,
    //参数校验失败
    PARAM_ERROR_CODE: 2001,
    //无token
    TOKEN: 2002,
    //XRP redis 余额变动发布订阅频道
    XRP_BALANCE_CHANGE: 'XRP_BALANCE_CHANGE'
};
