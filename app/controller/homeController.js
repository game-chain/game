'use strict';

const Controller = require('../core/baseController');
const NP = require('number-precision');

class HomeController extends Controller {

    async index() {
        const {ctx, app} = this;
        await ctx.render('index/index.html');
    }


    //结算工资
    async test() {
        const {ctx, app} = this;

        return this.success(await ctx.service.superNodeService.claimrewards());

        // const api = await ctx.helper.eosApi();
        // let result = await api.transact(
        //     {
        //         actions: [{
        //             account: 'eosio',
        //             name: 'claimrewards',
        //             authorization: [{actor: 'gameclaimrel', permission: 'active'}],
        //             data: {
        //                 owner: 'gamebp5'
        //             },
        //         }],
        //     },
        //     // 滞后块数，整数 // 超时秒数，整数
        //     {blocksBehind: 3, expireSeconds: 30})
        let result = {
            code: 200,
            data: {
                processed: {
                    action_traces: {
                        act: {
                            data: {
                                owner: "gamebp5"
                            }
                        },
                        inline_traces: [
                            {
                                act: {
                                    data: {
                                        quantity: "13906.8288  "
                                    }
                                }
                            },
                            {
                                act: {
                                    data: {
                                        quantity: "2781.3657 "
                                    }
                                }
                            },
                            {
                                act: {
                                    data: {
                                        quantity: "11125.4631 "
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        };
        const periods = ctx.helper.createID();
        let nodeBlock = {
            periods: periods,
            owner: result.data.processed.action_traces.act.data.owner,
            total_quantity: result.data.processed.action_traces.inline_traces[0].act.data.quantity,
            node_quantity: result.data.processed.action_traces.inline_traces[1].act.data.quantity,
            vote_quantity: result.data.processed.action_traces.inline_traces[2].act.data.quantity,
            processed_json: JSON.stringify(result),
            crate_time: ctx.helper.getDate()
        };
        ctx.service.nodeBlockService.create(nodeBlock);
    }

}

module.exports = HomeController;
