'use strict';

const Controller = require('../core/baseController');

class dividendController extends Controller {

    /**
     * 获取投票用户奖励总额
     * @returns {Promise<void>}
     */
    async getAmount() {
        const {ctx} = this;
        try {
            ctx.validate({
                owner: {type: 'string'},
            });
            const param = ctx.request.body;
            let result = {};
            result.total = await ctx.service.dividendService.getOwnerTotalAmount(param.owner);
            this.success(result);
        } catch (err) {
            this.fail(err.message, err.errors, ctx.PARAM_ERROR_CODE);
        }
    }

    /**
     * 获取投票用户奖励详情
     * @returns {Promise<void>}
     */
    async getDetails() {
        const {ctx} = this;
        try {
            ctx.validate({
                owner: {type: 'string', required: true},
                page: {type: 'number', required: false},
                limit: {type: 'number', required: false},
            });
            const param = ctx.request.body;
            this.success(await ctx.service.dividendService.getDetails(param.owner, param.page, param.limit));
        } catch (err) {
            this.fail(err.message, err.errors, ctx.PARAM_ERROR_CODE);
        }
    }

    /**
     * 奖励记录
     * @returns {Promise<void>}
     */
    async dividend() {
        let rewardTime = await this.ctx.service.configService.getValueByKey('reward_time');
        await this.ctx.render('dividend/dividend.html', {
            rewardTime: rewardTime.v
        });
    }

    async data() {
        const query = this.ctx.query;
        let result = await this.ctx.service.dividendService.list([], parseInt(query.start), parseInt(query.length));
        this.success(result);
    }
}

module.exports = dividendController;
