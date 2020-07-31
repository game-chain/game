'use strict';

const Controller = require('../core/baseController');

class userController extends Controller {

    async login() {
        const {ctx} = this;
        ctx.validate({
            account: {type: 'string'},
            password: {type: 'string'},
        });
        const param = ctx.request.body;
        if (param.account == 'admin' && param.password == '123456') {
            ctx.session.userInfo = {
                userId: "1",
                name: "测试"
            };
            await ctx.redirect('/');
        }
    }

    async outLogin() {
        this.ctx.session = null;
        await this.ctx.render('user/login.html');
    }
}

module.exports = userController;
