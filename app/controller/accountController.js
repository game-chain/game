'use strict';

const Controller = require('../core/baseController');

class accountController extends Controller {


    async info() {
        await this.ctx.render('user/account.html');
    }
}

module.exports = accountController;
