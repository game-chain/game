'use strict';

const Controller = require('../core/baseController');
const NP = require('number-precision');

class HomeController extends Controller {

    async index() {
        const {ctx, app} = this;
        await ctx.render('index/index.html');
    }

    async test() {
        const {ctx, app} = this;
        this.success(await ctx.service.rewardService.transfer());
    }

    //结算工资
    async test1() {
        const {ctx, app} = this;
        // const api = await ctx.helper.eosApi();
        // api.transact(
        //     {
        //         actions: [{
        //             account: 'eosio',
        //             name: 'claimrewards',
        //             authorization: [{
        //                 actor: ctx.app.config.eos.nodeRewardAccount,
        //                 permission: ctx.app.config.eos.nodeRewardPermission
        //             }],
        //             data: {
        //                 owner: 'gamebp5'
        //             },
        //         }],
        //     }, {blocksBehind: 5, expireSeconds: 30}).then(function (result) {
        //     if (result.code == 200) {
        //         let nodeBlock = {
        //             periods: periods,
        //             owner: result.data.processed.action_traces.act.data.owner,
        //             total_quantity: result.data.processed.action_traces.inline_traces[0].act.data.quantity,
        //             node_quantity: result.data.processed.action_traces.inline_traces[1].act.data.quantity,
        //             vote_quantity: result.data.processed.action_traces.inline_traces[2].act.data.quantity,
        //             processed_json: JSON.stringify(result),
        //             crate_time: ctx.helper.getDate()
        //         };
        //         ctx.service.nodeBlockService.create(nodeBlock);
        //     }
        // }).catch(function (e) {
        //     console.log(e);
        // })

        const api = await ctx.helper.eosApi();
        let result = await api.transact(
            {
                actions: [{
                    account: 'eosio',
                    name: 'claimrewards',
                    authorization: [{actor: 'gameclaimrel', permission: 'active'}],
                    data: {
                        owner: 'gamebp5'
                    },
                }],
            }, {blocksBehind: 3, expireSeconds: 30})
        const periods = ctx.helper.createID();
        let nodeBlock = {
            periods: periods,
            owner: result.processed.action_traces.act.data.owner,
            total_quantity: result.processed.action_traces.inline_traces[0].act.data.quantity,
            node_quantity: result.processed.action_traces.inline_traces[1].act.data.quantity,
            vote_quantity: result.processed.action_traces.inline_traces[2].act.data.quantity,
            processed_json: JSON.stringify(result),
            crate_time: ctx.helper.getDate()
        };
        ctx.service.nodeBlockService.create(nodeBlock);
        return this.success(result);
    }

}

module.exports = HomeController;
