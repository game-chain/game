'use strict';

const Controller = require('../core/baseController');

class voteRecordingController extends Controller {

    /**
     * 提交投票数据
     * @returns {Promise<void>}
     */
    async submitVote() {
        const {ctx} = this;
        try {
            ctx.validate({
                owner: {type: 'string'},
                bp_name: {type: 'string'},
                ticket: {type: 'number'},
            });
            const param = ctx.request.body;
            let result = {};
            result.total = await ctx.service.voteRecordingService.create(param.owner, param.bp_name, param.ticket);
            this.success(result);
        } catch (err) {
            this.fail(err.message, err.errors, ctx.PARAM_ERROR_CODE);
        }
    }

    /**
     * 获取用户投票记录
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
            this.success(await ctx.service.voteRecordingService.getList(param.owner, param.pge, param.limit));
        } catch (err) {
            this.fail(err.message, err.errors, ctx.PARAM_ERROR_CODE);
        }
    }

    /**
     * 奖励记录
     * @returns {Promise<void>}
     */
    async vote() {
        let result = await this.ctx.service.voteRecordingService.list([], 1, 10);
        await this.ctx.render('vote/vote.html', {
            list: result.rows
        });
    }
}

module.exports = voteRecordingController;
