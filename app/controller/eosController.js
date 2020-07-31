'use strict';

const Controller = require('../core/baseController');

/**
 * @explain eos基础接口
 * @author xiaoping
 * @date 2020.1.10
 */
class EosController extends Controller {

    /**
     * 获取超级节点
     * @returns {Promise<void>}
     */
    async node() {
        let result = await this.ctx.service.superNodeService.list([], 1, 10);
        let rewardTime = await this.ctx.service.configService.getValueByKey('reward_time');
        await this.ctx.render('node/node.html', {
            list: result.rows,
            rewardTime: rewardTime.v
        });
    }

    /**
     * 获取投票用户
     * @returns {Promise<void>}
     */
    async voters() {
        const {app, ctx} = this;
        const param = ctx.query;

        let node = await this.ctx.service.superNodeService.find(param.nodeId);
        let result = await this.ctx.service.voterService.list({'node_bp_id': param.nodeId}, 1, 10);
        if (result) {
            result.rows.forEach(function (val, index, key) {
                let totalReward = val.staked * 0.8;
                val.vote_proportion = node.total_votes / val.staked;
                val.vote_proportion = val.vote_proportion > 100 ? 100 : val.vote_proportion;
                val.vote_reward = totalReward * val.vote_proportion;
            });
        }

        await this.ctx.render('node/voters.html', {
            list: result.rows,
            node: node,
        });
    }

    /**
     * 同步链上投票数据
     * @returns {Promise<void>}
     */
    async synchronizeCollection() {
        const {app, ctx} = this;
        let result = await this.ctx.service.eosService.collection(true);
        this.success();
    }

    /**
     * 同步超级节点信息
     * @returns {Promise<void>}
     */
    async synchronizeSuperNode() {
        const {app, ctx} = this;
        let result = await this.ctx.service.eosService.superNode();
        this.success();
    }

    /**
     * 修改定时任务周期
     * @returns {Promise<void>}
     */
    async cycle() {
        const {ctx} = this;
        await ctx.service.configService.update('reward_time', {v: ctx.request.body.cycle});
        var fs = require('fs');
        const data = await this.ctx.service.scheduleService.readJson();
        fs.writeFile('config/schedule.json', JSON.stringify(data), 'utf8', function (err) {
            if (!err) {
                ctx.redirect('/node');
            }
        })
    }

    /**
     * 获取节点信息
     *
     * @return {Promise<void>}
     */
    async info() {
        const {ctx} = this;
        this.success(await ctx.service.eosService.getInfo());
    }

    /**
     * 获取块信息
     *
     * @return {Promise<void>}
     */
    async block() {
        const {ctx} = this;
        ctx.validate({
            block_num_or_id: {type: 'string'},
        });
        this.success(await ctx.service.eosService.getBlock(ctx.request.body.block_num_or_id));
    }

    /**
     * 获取合约随机数
     *
     * @return {Promise<void>}
     */
    async getTable() {
        const {ctx, app} = this;
        const eos = app.config.eos;
        const limit = 100;
        this.success(await ctx.service.eosService.getTable(eos.code, eos.table, eos.scope, limit));
    }

    /**
     * 删除合约数据
     *
     * @return {Promise<void>}
     */
    async del() {
        const {ctx} = this;
        const param = {
            user: 'sbihgutest11',
            periods: ctx.request.body.periods,
        };
        ctx.body = await ctx.service.eosService.execContract('sbihgutest11', 'del', param);
    }

    /**
     *  新增期数
     *
     * @return {Promise<void>}
     */
    async random() {
        const {ctx, app} = this;
        ctx.validate({
            periods: {type: 'int', required: true},
            random: {type: 'int', required: true},
            currency: {type: 'enum', values: ['EOS', 'BTC', 'XRP', 'ETH', 'TRX'], required: true},
            min: {type: 'enum', values: [1]},
            max: {type: 'enum', values: [19]},
            digit: {type: 'enum', values: [4]},
        });
        const eos = app.config.eos;
        const param = ctx.request.body;
        const execParam = {
            user: eos.account,
            periods: param.periods,
            number: param.random,
            currency: param.currency,
            min: param.min,
            max: param.max,
            digit: param.digit
        };
        this.success(await ctx.service.eosService.execContract(eos.account, eos.random, execParam));
    }

    /**
     * 获取账号信息
     *
     * @return {Promise<void>}
     */
    async getAccount() {
        const {ctx} = this;
        ctx.validate({
            account: {type: 'string'},
        });
        this.success(await ctx.service.eosService.getAccount(ctx.request.body.account));
    }

    /**
     * 获取账号余额
     *
     * @return {Promise<void>}
     */
    async getBalance() {
        const {ctx} = this;
        ctx.validate({
            type: {type: 'string'}, // 代币类型
            account: {type: 'string'}, // 账号
        });
        this.success(await ctx.service.eosService.getBalance(ctx.request.body.type, ctx.request.body.account));
    }

    /**
     * 返回指定数据表的查询结果(方法必须配置filter-on=*或打开mongodb插件)
     *
     * @return {Promise<void>}
     */
    async getActions() {
        const {ctx} = this;
        ctx.validate({
            account: {type: 'string'},
        });
        const param = ctx.request.body;
        this.success(await ctx.service.eosService.getActions(param.account, 0, 0));
    }

    /**
     * 创建公钥和私钥
     *
     * @return {Promise<void>}
     */
    async createKey() {
        const {ctx} = this;
        this.success(await ctx.service.eosService.createKey());
    }

    /**
     * 新建账号
     *
     * @return {Promise<void>}
     */
    async createAccount() {
        const {ctx} = this;
        ctx.validate({
            oldAccount: {type: 'string'},
            newAccount: {type: 'string'},
            publicKey: {type: 'string'},
        });
        const param = ctx.request.body;
        this.success(await ctx.service.eosService.createAccount(param.oldAccount, param.newAccount, param.publicKey));
    }

    /**
     * 转账
     *
     * @return {Promise<void>}
     */
    async transfer() {
        const {ctx} = this;
        ctx.validate({
            originator: {type: 'string'},
            receiver: {type: 'string'},
            quantity: {type: 'string'},
        });
        const param = ctx.request.body;
        this.success(await ctx.service.eosService.transfer(param.originator, param.receiver, param.quantity, param.memo));
    }

    /**
     * 购买内存
     *
     * @return {Promise<void>}
     */
    async buyRam() {
        const {ctx} = this;
        ctx.validate({
            account: {type: 'string'},
            size: {type: 'number'},
        });
        const param = ctx.request.body;
        this.success(await ctx.service.eosService.buyRamBytes(param.account, param.size));
    }

    /**
     * 抵押eos获得cpu和net
     *
     * @return {Promise<void>}
     */
    async mortgage() {
        const {ctx} = this;
        ctx.validate({
            account: {type: 'string'},
            cpu: {type: 'string'},
            net: {type: 'string'},
        });
        const param = ctx.request.body;
        this.success(await ctx.service.eosService.delEgatebw(param.account, param.cpu, param.net));
    }
}

module.exports = EosController;

