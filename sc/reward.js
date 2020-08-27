'use strict';

const SchexJob = require('egg-schex').SchexJob;

const init_ctx = {
    test: 0, // 任务属性
    subJob: {
        cnt: 0, // 子任务属性
    },
};

class UpdateCache extends SchexJob {

    constructor(ctx, sc, job) {
        super(ctx, sc, job);

        this.subJobName = job.name + '-sub_t'; // 子任务名称
        this.cnt = 1;
    }

    // 任务初始化函数，在这里设置初始化数据
    onActInit() {
        this._job.ctx = Object.assign({}, init_ctx);
        this.logger.info('[schex] 初始化结算工资任务...');
    }

    /** 任务处理函数 */
    async onActRun() {
        const {ctx, cfg} = this._job; // 获取任务的 ctx
        const {ctx: ectx, app} = this; // 获取 egg 的 ctx 和 app
        this.logger.info(ectx.helper.getDate() + '开始结算超级节点工资：' + this._job.name);
        //结算工资
        
    }

    async onActStop() {
        this._job.ctx = init_ctx;
    }

    /** 子任务处理
     * @param {Object} job 子任务结构
     */
    async onActSubRun(job) {
        this._job.ctx.subJob.cnt++;
        job.msg = `${this._job.ctx.subJob.cnt}`;
    }

    /** 子任务停止
     * @param {Object} job 子任务结构
     */
    async onActSubStop(job) {
        this._job.ctx.subJob.cnt = 0;
    }
}

module.exports = UpdateCache;
