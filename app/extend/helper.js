'use strict';

const {Api, JsonRpc} = require('eosjs');
const {JsSignatureProvider} = require('eosjs/dist/eosjs-jssig');
const fetch = require('node-fetch');
const {TextEncoder, TextDecoder} = require('text-encoding');
const fecha = require('fecha');

/**
 * egg 帮助类
 * @type {{getInfo: getInfo, eosRpc: JsonRpc, eosApi: (function(*)), getEosUrl: getEosUrl}}
 */
module.exports = {

    /**
     * 获取eos可用节点地址
     *
     * @returns {Promise<void>}
     */
    getEosUrl: async function () {
        const {app} = this;
        let nodes = app.config.eos.nodes;
        for (let i = 0; i < nodes.length; i++) {
            const result = await app.curl(nodes[i], {
                dataType: "json",
                method: 'GET'
            });
            const url = result.data.nodes[0].api_endpoint;
            let rpc = new JsonRpc(url, {fetch});
            const isAvailable = await this.getInfo(rpc);
            if (isAvailable) {
                return url;
            }
        }
    },

    /**
     * 检测节点是否达到已有高度
     *
     * @param rpc 节点地址
     * @returns {Promise<boolean>} 是否可用
     */
    getInfo: async function (rpc) {
        let getInfoResult = await rpc.get_info();
        if (getInfoResult.head_block_num >= this.app.config.eos.head_block_num) {
            return true;
        }
        return false;
    },

    /**
     * 获取可用eos rpc对象
     *
     * @type {JsonRpc} eos Rpc 对象
     */
    eosRpc: async function () {
        const {app, ctx} = this;
        const rpcUrl = app.config.eos.rpcUrl;
        return new JsonRpc(rpcUrl, {fetch});
    },

    /**
     *  创建eos Api对象，
     * @param eosRpc 用于合约、转账、创建账号等
     * @returns {Api} api对象
     */
    eosApi: async function () {
        //本地环境
        if (this.ctx.app.config.env == 'local') {
            const rpc = new JsonRpc('https://jungle2.cryptolions.io:443', {fetch});
            const privateKey = '5J6R3MsgyTqid2TYudmpX33MUCwLc4ddH421HYkPK3NjZMTmpM6';
            const signatureProvider = new JsSignatureProvider([privateKey]);
            return new Api({rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder()});
        } else {
            //生产环境
            const url = await this.getEosUrl();
            const rpc = new JsonRpc(url, {fetch});
            const signatureProvider = new JsSignatureProvider([this.app.config.eos.privateKey]);
            return new Api({rpc, signatureProvider, TextEncoder: new TextDecoder(), textEncoder: new TextEncoder()});
        }
    },

    /**
     * 生成分布式id
     * @returns {Promise<string>}
     */
    createID() {
        const {simpleflake} = require('simpleflakes');
        const flakeBigInt = simpleflake();
        return flakeBigInt.toString();       // 4234673179811182512
    },

    /**
     * 获取当前时间
     * @returns {string}
     */
    getDate() {
        const moment = require('moment');
        return moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    },

    /**
     * 时间格式化
     * @param date
     * @returns {string}
     */
    formatToDayTime(date = new Date()) {
        return fecha.format(date, 'YYYY-MM-DD HH:mm:ss');
    },

    /**
     * xrp连接到服务器
     * @returns {Promise<RippleAPI>}
     * @constructor
     */
    XrpApi: async function () {
        return new RippleAPI({
            server: 'wss://s.altnet.rippletest.net:51233' // test rippled server
        });
    },

    /**
     * 转int
     * @param string
     * @returns {number|*}
     */
    parseInt(string) {
        if (typeof string === 'number') return string;
        if (!string) return string;
        return parseInt(string) || 0;
    },
    /**
     * Hmac 使用md5方式
     * @param str 待加密的数据字符串
     * @returns {string} 加密后的
     */
    encryption(str) {
        const crypto = require('crypto');
        const key = this.app.config.systems.key;
        const hmac = crypto.createHmac('MD5', key);
        hmac.update(str);
        return hmac.digest('hex');
    },

    /**
     * 获取奖励时间
     * @returns {Promise<string>}
     */
    getRewardTime: async function () {
        const {app} = this;
        return await app.redis.get('time');
    }

};


