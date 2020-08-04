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
        ctx.session.userInfo = await ctx.service.adminUserService.find(param.account, param.password);
        if (ctx.session.userInfo) {
            await ctx.redirect('/');
        }
    }
    
    async password() {
        const {ctx} = this;
        ctx.validate({
            password: {type: 'string'}
        });
        const param = ctx.request.body;
        await ctx.service.adminUserService.update(ctx.session.userInfo.name, param.password);
    }

    async outLogin() {
        this.ctx.session = null;
        await this.ctx.render('user/login.html');
    }
}

module.exports = userController;
