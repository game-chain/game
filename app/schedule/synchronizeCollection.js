module.exports = {

    schedule: {
        cron: '0 0 */3 * * *', //3小时执行一次
        type: 'all', // 指定所有的 worker 都需要执行
    },

    async task(ctx) {
        console.log('开始同步链上数据:');
        ctx.service.eosService.collection(true);
    },
};
