'use strict';

const Controller = require('../core/baseController');
const NP = require('number-precision');

class HomeController extends Controller {

    async index() {
        const {ctx, app} = this;
        await ctx.render('index/index.html');
    }

    async loop(arr) {
        const {ctx, app} = this;
        console.log('start')
        for (const item of arr) {

        }
    }

    async test() {
        const {ctx, app} = this;
        //await ctx.service.rewardService.transfer();

        await ctx.service.superNodeService.claimrewards();
        this.success();
        // let nodeBlock = await ctx.service.nodeBlockService.getAll();
        // nodeBlock.rows.forEach(function (nodeVal) {
        //     let node = JSON.parse(nodeVal.processed_json);
        //     // console.log(node.processed.action_traces[0].act.data.owner);
        //     let nodeBlock = {
        //         total_quantity: node.processed.action_traces[0].inline_traces[0].act.data.quantity.replace('GAME', ''),
        //         node_quantity: node.processed.action_traces[0].inline_traces[1].act.data.quantity.replace('GAME', ''),
        //         vote_quantity: node.processed.action_traces[0].inline_traces[2].act.data.quantity.replace('GAME', '')
        //     };
        //     ctx.service.nodeBlockService.update(nodeVal.periods, node.processed.action_traces[0].act.data.owner, nodeBlock);
        // });
    }

    //结算工资
    async test1() {
        const {ctx, app} = this;
        await nodes.rows.forEach(function (node, nodeIndex, nodeKey) {
            api.transact(
                {
                    actions: [{
                        account: 'eosio',
                        name: 'claimrewards',
                        authorization: [{
                            actor: ctx.app.config.eos.nodeRewardAccount,
                            permission: ctx.app.config.eos.nodeRewardPermission
                        }],
                        data: {
                            owner: node.owner
                        },
                    }],
                }, {blocksBehind: 3, expireSeconds: 30})
                .then(function (result) {
                    let nodeBlock = {
                        periods: periods,
                        owner: node.owner,
                        processed_json: JSON.stringify(result),
                        crate_time: ctx.helper.getDate()
                    };
                    ctx.service.nodeBlockService.create(nodeBlock).then(function (nodeBlockResult) {

                    });
                }).catch(function (e) {
                console.log(e);
            })
        });
    }

}

module.exports = HomeController;
