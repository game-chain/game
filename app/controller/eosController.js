'use strict';

const Controller = require('../core/baseController');
const NP = require('number-precision');

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
        await this.ctx.render('node/node.html',);
    }

    /**
     * 超级节点信息
     * @returns {Promise<void>}
     */
    async nodeData() {

        const {app, ctx} = this;

        let url = app.config.eos.gameApi + 'nos-iot/v1/noschain/getProducers';
        let nodeInfo = await this.ctx.curl(url, {
            method: "GET",
            dataType: "json",
            timeout: 50000
        });

        const query = this.ctx.query;
        let result = await this.ctx.service.superNodeService.list([], parseInt(query.start), parseInt(query.length));
        nodeInfo.data.Data.rows.forEach(function (nodeVal, nodeIndex, nodeKey) {
            result.rows.forEach(function (val, index, key) {
                if (val.owner == nodeVal.owner) {
                    val.setDataValue('total_ticket', NP.times(NP.divide(nodeVal.total_votes, nodeInfo.data.Data.total_producer_vote_weight).toFixed(4), 100) + "%");
                }
            })
        });
        this.success(result);
    }

    /**
     * 获取投票用户
     * @returns {Promise<void>}
     */
    async voters() {
        const {app, ctx} = this;
        const param = ctx.query;
        let node = await this.ctx.service.superNodeService.findByName(param.owner);
        let result = await this.ctx.service.voterService.list({'bp_owner': param.owner});
        let nodeTotalStaked = await this.ctx.service.voterService.getStakedByBp(node.owner);
        node.setDataValue('total_votes', NP.plus(nodeTotalStaked, 0).toFixed(4));
        if (result) {
            result.rows.forEach(function (val, index, key) {
                let totalReward = NP.times(nodeTotalStaked, 0.8).toFixed(4);
                val.vote_proportion = 0;
                val.vote_reward = 0;
                if (val.staked > 0) {
                    val.vote_proportion = NP.divide(val.staked, nodeTotalStaked).toFixed(4);
                    val.vote_proportion = val.vote_proportion >= 1 ? 1 : val.vote_proportion;
                    val.vote_reward = NP.times(totalReward, val.vote_proportion).toFixed(4);
                    val.vote_proportion = NP.times(val.vote_proportion, 100).toFixed(4);
                }
            });
        }
        node.setDataValue("location", node.location == 0 ? '未知' : node.location);
        await this.ctx.render('node/voters.html', {
            list: result.rows,
            node: node,
            total_ticket: param.total_ticket
        });
    }

    /**
     * 同步链上投票数据
     * @returns {Promise<void>}
     */
    async synchronizeCollection() {
        let result = await this.ctx.service.eosService.collection(true);
        this.success();
    }

    /**
     * 同步超级节点信息
     * @returns {Promise<void>}
     */
    async synchronizeSuperNode() {
        const {app, ctx} = this;
        this.success(await ctx.service.eosService.superNode());
    }

    /**
     * 修改定时任务周期
     * @returns {Promise<void>}
     */
    async cycle() {
        const {ctx} = this;
        await ctx.service.configService.update('reward_time', {v: ctx.request.body.cycle});
        this.app.schex.updateJob('reward',
            {
                cron: "* */" + ctx.request.body.cycle + " * * * *",
                fun: "./sc/reward.js",
                switch: true,
            },
            {
                path: 'update',
            }
        );
        // var fs = require('fs');
        // //const data = await this.ctx.service.scheduleService.readJson();
        // let data = {
        //     "reward": {
        //         "base": {
        //             "cron": "* */" + ctx.request.body.cycle + " * * * *",
        //             "fun": "./sc/reward.js",
        //             "switch": true
        //         },
        //         "cfg": {"rUrl": "http://test.com"}
        //     }
        // };
        // fs.writeFile('config/schedule.json', JSON.stringify(data), 'utf8', function (err) {
        //     if (!err) {
        //         ctx.redirect('/dividend');
        //     }
        // })
        ctx.redirect('/dividend');
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

