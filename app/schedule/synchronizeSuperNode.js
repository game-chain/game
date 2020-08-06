module.exports = {

    schedule: {
        cron: '0 0 */3 * * *', //3小时执行一次
        type: 'all', // 指定所有的 worker 都需要执行
    },

    /**
     * 同步超级节点信息
     * @param ctx
     * @returns {Promise<void>}
     */
    async task(ctx) {
        console.log('开始同步超级节点信息:');
        ctx.service.eosService.superNode(true);
    },

};
