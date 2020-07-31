'use strict';

const Controller = require('../core/baseController');


/**
 * @explain jwt验证登录
 * @author xiaoping
 * @date 2020.2.10
 */
class JwtController extends Controller {

    /**
     * 请求登录验证
     *
     * @returns {Promise<void>}
     */
    async login() {
        const {ctx, app} = this;
        ctx.validate({
            appKey: {type: 'string'},
            secret: {type: 'string'}
        });
        const param = ctx.request.body;
        if (param.appKey != 'be54c1776c7ad8d050ef06ff' || param.secret != '645c7c4622a251b14e4a6b6d') {
            this.fail("Unknown authorization");
            return;
        }
        let userToken = {
            AppKey: param.appKey
        };
        const token = app.jwt.sign(userToken, app.config.jwt.secret, {expiresIn: app.config.jwt.expires});
        this.success({"token": token});
    }

    /**
     * 验证身份
     *
     * @returns {Promise<void>}
     */
    async index() {
        const {ctx, app} = this;
        const token = ctx.header.authorization;  // 获取jwt
        let payload;
        if (token) {
            payload = await app.jwt.verify(token.split(' ')[1], app.config.jwt.secret);  // // 解密，获取payload
            this.success(payload);
        } else {
            ctx.body = {
                message: 'token 错误',
                code: -1
            }
        }
    }
    
}

module.exports = JwtController;
