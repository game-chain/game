'use strict';

const {Controller} = require('egg');

/**
 * 父类控制器
 *
 * BaseController
 * @class
 * @author sbihgu
 */
class BaseController extends Controller {

    /**
     *  正确返回
     * @param data
     * @param status
     */
    success(data, status) {
        this.ctx.set('content-type', 'text/json');
        this.ctx.body = {
            code: this.ctx.SUCCESS_CODE,
            message: '成功',
            data,
        };
        this.ctx.status = status || 200;
    }

    /**
     * 失败返回
     * @param message
     * @param details
     * @param code
     */
    fail(message, details, code) {
        this.ctx.body = {
            code: code ? code : this.ctx.FAIL_CODE,
            message: message ? message : '获取失败',
            details,
        };
        this.ctx.status = 200;
    }

    /**
     * 错误返回
     * @param msg
     */
    notFound(msg) {
        msg = msg || 'not found';
        this.ctx.throw(500, msg);
    }

}

module.exports = BaseController;
