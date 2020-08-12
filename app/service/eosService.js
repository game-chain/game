'use strict';

const Service = require('egg').Service;
const ecc = require('eosjs-ecc');
const NP = require('number-precision');

/**
 * @explain eos基础服务
 * @author xiaoping
 * @date 2020.2.10
 */
class eosService extends Service {

    /**
     * 获取eos node 基本信息
     *
     * @return {Promise<GetInfoResult>}
     */
    async getInfo() {
        let rpc = await this.ctx.helper.eosRpc();
        return await rpc.get_info();
    }

    /**
     * 获取块信息
     *
     * @param blockId 块id
     * @return {Promise<*>}
     */
    async getBlock(blockId) {
        let rpc = await this.ctx.helper.eosRpc();
        return await rpc.get_block(blockId);
    }

    /**
     * 获取合约产生的数据
     *
     * @param code 合约所属账号
     * @param table 表名
     * @param scope 作用范围
     * @param periods 期数(表内字段)
     * @param limit  条数
     * @returns {Promise<any>}
     */
    async getTable(code, table, scope, limit) {
        //预设参数
        const data = {"scope": scope, "code": code, "table": table, "json": true, "upper_bound": -1, "limit": limit};
        let rpc = await this.ctx.helper.eosRpc();
        return await rpc.get_table_rows(data);
    }

    /**
     * 执行合约
     * @param account 合约账号
     * @param execFunction 合约方法
     * @param permission
     * @param param 合约所需参数
     * @return {Promise<any>}
     */
    async execContract(account, execFunction, param) {
        const api = await this.ctx.helper.eosApi();
        return await api.transact(
            {
                actions: [{
                    account,
                    name: execFunction,
                    authorization: [{actor: account, permission: 'active',}],
                    data: param,
                }],
            },
            {blocksBehind: 3, expireSeconds: 30,});// 滞后块数，整数 // 超时秒数，整数
    }

    /**
     * 获取账号信息
     * @param account
     * @return {Promise<any>}
     */
    async getAccount(account) {
        let rpc = await this.ctx.helper.eosRpc();
        return await rpc.get_account(account);
    }

    /**
     * 获取账号余额
     * @param type 代币类型
     * @param account 账号
     * @return {Promise<any>}
     */
    async getBalance(type, account) {
        let rpc = await this.ctx.helper.eosRpc();
        return await rpc.get_currency_balance(type, account);
    }

    /**
     * 返回指定数据表的查询结果(方法必须配置filter-on=*或打开mongodb插件)
     * @param account_name 账号名称
     * @param pos 起始位置，可选
     * @param offset 偏移量，可选
     * @return {Promise<any>}
     */
    async getActions(account_name, pos, offset) {
        let rpc = await this.ctx.helper.eosRpc();
        return await rpc.history_get_actions('sbihgutest11', -1, -100);
    }

    /**
     * 生成公钥和私钥
     * @return {Promise<void>}
     */
    async createKey() {
        // 创建账号前，生成公私钥，需要使用 eosjs-ecc 模组
        const privateKey = await ecc.randomKey();
        const publicKey = ecc.privateToPublic(privateKey);
        return {
            privateKey,
            publicKey,
        };
    }

    /**
     *  创建新账号
     * @param oldAccount 原始账号
     * @param newAccount 创建账号
     * @param publicKey  生成的公钥
     * @return {Promise<any>}
     */
    async createAccount(oldAccount, newAccount, publicKey) {
        const {ctx, app} = this;
        if (!ecc.isValidPublic(publicKey)) {
            this.ctx.throw(app.FAIL_CODE, '公钥格式验证失败');
        }
        const api = await this.ctx.helper.eosApi();
        return await api.transact({
            actions: [{
                // 这个account是指合约名
                account: 'eosio',
                // 创建新账号的action名
                name: 'newaccount',
                authorization: [{
                    actor: oldAccount,
                    permission: 'active',
                }],
                data: {
                    creator: oldAccount,
                    // 这里的name指的是新用户的名字，在内部测试时候用的是name这个字段。
                    name: newAccount,
                    // newcat 是公测链，新用户名的参数，可能版本不一样，字段不一样
                    newact: newAccount,
                    owner: {
                        threshold: 1,
                        keys: [{
                            // 写入上面新生成的公钥
                            key: publicKey,
                            weight: 1,
                        }],
                        accounts: [],
                        waits: [],
                    },
                    active: {
                        threshold: 1,
                        keys: [{
                            // 写入上面新生成的公钥
                            key: publicKey,
                            weight: 1,
                        }],
                        accounts: [],
                        waits: [],
                    },
                },
            },
                {
                    account: 'eosio',
                    // 购买内存的action名
                    name: 'buyrambytes',
                    authorization: [{
                        actor: oldAccount,
                        permission: 'active',
                    }],
                    data: {
                        payer: oldAccount,
                        receiver: newAccount,
                        bytes: 2996, // 购买2996
                    },
                },
                // 抵押eos获得cpu、net
                {
                    account: 'eosio',
                    // 抵押资产的action名，用于租用带宽与cpu,抵押资产,抵押的越多，带宽和cup就越多
                    name: 'delegatebw',
                    authorization: [{
                        actor: oldAccount,
                        permission: 'active',
                    }],
                    data: {
                        from: oldAccount,
                        receiver: newAccount,
                        // 货币单位,是SYS或者EOS
                        stake_net_quantity: '0.1000 EOS',
                        stake_cpu_quantity: '0.1000 EOS',
                        transfer: false,
                    },
                },
            ],
        }, {
            blocksBehind: 3,
            expireSeconds: 120,
        });
    }

    /**
     * 转账
     * @param originator 发起人
     * @param receiver   接受人
     * @param quantity   金额（强制4位小数）
     * @param memo       标签
     * @return {Promise<any>}
     */
    async transfer(originator, receiver, quantity = '1.0000', memo = '') {
        const api = await this.ctx.helper.eosApi();
        return await api.transact({
            actions: [{
                account: 'eosio.token',
                name: 'transfer',
                authorization: [{
                    actor: originator,
                    permission: 'active',
                }],
                data: {
                    from: originator,
                    to: receiver,
                    quantity: quantity + 'EOS',
                    memo,
                },
            }],
        }, {
            blocksBehind: 3,
            expireSeconds: 30,
        });
    }

    /**
     * 购买内存
     * @param account 账号
     * @param size    购买内存大小（单位kb）
     * @return {Promise<any>}
     */
    async buyRamBytes(account, size) {
        const api = await this.ctx.helper.eosApi();
        return await api.transact({
            actions: [{
                account: 'eosio',
                // 购买内存的action名
                name: 'buyrambytes',
                authorization: [{
                    actor: account,
                    permission: 'active',
                }],
                data: {
                    payer: account,
                    receiver: account,
                    bytes: (size * 1024),
                },
            }],
        }, {
            blocksBehind: 3,
            expireSeconds: 30,
        });
    }

    /**
     * 抵押eos获得cpu和net
     * @param account 抵押账号
     * @param cpu 需要带货币类型 空格隔开 格式 1.0000 EOS
     * @param net 需要带货币类型 空格隔开 格式 1.0000 EOS
     * @return {Promise<any>}
     */
    async delEgatebw(account, cpu, net) {
        const api = await this.ctx.helper.eosApi();
        return await api.transact({
            actions: [{
                account: 'eosio',
                // 抵押资产的action名，用于租用带宽与cpu,抵押资产,抵押的越多，带宽和cup就越多
                name: 'delegatebw',
                authorization: [{
                    actor: account,
                    permission: 'active',
                }],
                data: {
                    from: account,
                    receiver: account,
                    // 货币单位,是SYS或者EOS
                    stake_net_quantity: net,
                    stake_cpu_quantity: cpu,
                    transfer: false,
                },
            },
            ],
        }, {
            blocksBehind: 3,
            expireSeconds: 120,
        });
    }


    /**
     * 采集链上投票数据
     * @param account
     * @param cpu
     * @param net
     * @returns {Promise<void>}
     */
    async collection(isQuantity = false) {
        const {ctx, app} = this;
        const eos = app.config.eos;
        const limit = 100;
        const result = await this.getTable(eos.code, eos.table, eos.scope, limit);
        console.log(result);
        result.rows.forEach(function (val, index, key) {
            val['producers'].forEach(function (p) {
                ctx.service.superNodeService.findByName(p).then(result => {
                    const voters = {
                        id: ctx.helper.createID(),
                        owner: val['owner'],
                        node_bp_id: result.id,
                        proxy: val['proxy'],
                        producers: JSON.stringify(val['producers']),
                        staked: NP.divide(val['staked'], 10000),
                        last_vote_weight: val['last_vote_weight'],
                        proxied_vote_weight: val['proxied_vote_weight'],
                        is_proxy: val['is_proxy'],
                        flags1: val['flags1'],
                        reserved2: val['reserved2'],
                        reserved3: val['reserved3'],
                        create_time: ctx.helper.getDate(),
                        update_time: ctx.helper.getDate()
                    };
                    ctx.service.voterService.getCount(val['owner']).then(result => {
                        if (result > 0) {
                            delete voters.id;
                            delete voters.create_time;
                            ctx.service.voterService.update(val['owner'], voters);
                        } else {
                            const submitResult = ctx.service.voterService.create(voters);
                        }
                    });
                });
            });
        });
    }

    /**
     * 同步超级节点信息
     * @returns {Promise<void>}
     */
    async superNode() {
        const {ctx, app} = this;
        let url = app.config.eos.gameApi + 'nos-iot/v1/noschain/getProducers';
        let result = await ctx.curl(url, {
            method: "GET",
            dataType: "json",
            headers: {
                "content-type": "application/json"
            },
            timeout: 50000
        });
        result = result.data;
        if (result.StatusCode != 200) {
            this.ctx.throw(400, '同步超级节点信息错误');
        }
        result.Data.rows.forEach(function (val, index, key) {
            ctx.service.superNodeService.findByName(val['owner']).then(result => {
                let details = {
                    is_active: val['is_active'],
                    last_claim_time: val['last_claim_time'],
                    location: val['location'],
                    owner: val['owner'],
                    producer_authority: JSON.stringify(val['producer_authority']),
                    producer_key: val['producer_key'],
                    total_votes: val['total_votes'],
                    unpaid_blocks: val['unpaid_blocks'],
                    url: val['url'],
                    create_time: ctx.helper.getDate(),
                    update_time: ctx.helper.getDate()
                };
                if (result == null) {
                    details.id = ctx.helper.createID();
                    ctx.service.superNodeService.create(details);
                } else {
                    ctx.model.SuperNode.update(details, {
                        where: {
                            id: result.id
                        }
                    });
                }
            }).catch(err => {
                this.ctx.throw(400, '同步超级节点信息错误');
            });
        });
    }
}

module.exports = eosService;
