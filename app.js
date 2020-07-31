class App {

    /**
     *  构造函数，注入app
     *
     * @param app
     */
    constructor(app) {
        this.app = app;
        this.start = Date.now();
    }

    /**
     * 配置文件即将加载 可动态修改配置文件
     *
     * @returns {Promise<void>}
     */
    async configWillLoad() {
        // 此时 config 文件已经被读取并合并，但是还并未生效
        // 这是应用层修改配置的最后时机
        // 注意：此函数只支持同步调用

        // var fs = require('fs');
        // const data = await this.ctx.service.scheduleService.readJson();
        // fs.writeFile('config/schedule.json', JSON.stringify(data), 'utf8', function (err) {
        //     if (err) {
        //         console.log("定时任务文件更新错误...");
        //     } else {
        //         console.log("定时任务文件更新完成...");
        //     }
        // })
        this.app.logger.warn("配置文件正在加载...");
    }

    /**
     * 配置文件加载完成
     *
     * @returns {Promise<void>}
     */
    async configDidLoad() {
        this.app.logger.warn("配置文件加载完成...");
    }

    /**
     * 系统文件加载完成
     *
     * @returns {Promise<void>}
     */
    async didLoad() {
        this.app.logger.warn("系统文件加载完成...");
    }

    /**
     * 插件加载完成
     *
     * @returns {Promise<void>}
     */
    async willReady() {
        this.app.logger.warn("插件加载完成...");
    }

    /**
     * worker 准备就绪
     *
     * @returns {Promise<void>}
     */
    async didReady() {
        // 应用已经启动完毕
        this.app.logger.warn("进程启动完成...");
    }

    /**
     * 应用启动完成
     *
     * @returns {Promise<void>}
     */
    async serverDidReady() {
        const {app} = this;
        // app.kue.process('transfer', (job, done) => {
        //     // 这里可以调用service里面的方法来消费这些信息
        //
        // });
        app.kue.process('transfer', function (job, done) {
            const ctx = app.createAnonymousContext();
            ctx.service.rewardService.transfer(job.data, done);
            done();
        });

        this.app.logger.warn('服务已经启动...');
        this.app.logger.warn('启动耗时 %d ms', Date.now() - this.start);

    }

    /**
     * 应用即将关闭
     *
     * @returns {Promise<void>}
     */
    async beforeClose() {
        this.app.logger.warn("应用即将关闭...");
    }

}

module.exports = App;
