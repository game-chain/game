'use strict';

const Controller = require('../core/baseController');

class scheduleController extends Controller {

    /**
     * 定时任务状态
     * @returns {Promise<void>}
     */
    async index() {
        let schedule = await this.app.redis.hgetall("game:schedule:status");
        if (!schedule) {
            await this.app.schex.startJob('reward');
            schedule = await this.app.redis.hgetall("game:schedule:status");
        }
        let jobs = await this.app.redis.hgetall("game:schedule:jobs");
        let data = JSON.parse(schedule.reward);
        let jobs_data = JSON.parse(jobs.reward);
        let latestRunTime = this.ctx.helper.formatToDayTime(data.latestRunTime);
        let startTime = this.ctx.helper.formatToDayTime(data.startTime);
        await this.ctx.render('schedule/index.html', {
            schedule: data,
            latestRunTime: latestRunTime,
            startTime: startTime,
            jobs: jobs_data
        });
    }

    /**
     * 开启任务
     * @returns {Promise<void>}
     */
    async start() {
        const retInfo = await this.app.schex.startJob('reward');
        this.success();
    }

    /**
     * 关闭任务
     * @returns {Promise<void>}
     */
    async stop() {
        //let d = await this.app.schex.getJobStatus();
        const retInfo = await this.app.schex.stopJob('reward');
        this.success();
    }
}

module.exports = scheduleController;
