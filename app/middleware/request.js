'use strict';

/**
 *  中间件 在控制台中输出请求信息
 * @param options
 * @param app
 * @return {exec}
 */
module.exports = (options, app) => {

    return async function WebAuthentication(ctx, next) {
        // console.log('==========================================================================================================================================>');
        // console.log('时间：' + app.formatToDayTime());
        // console.log('地址：' + ctx.originalUrl);
        // console.log('IP：' + ctx.ip);
        // console.log(ctx.request.header);
        // console.log('参数：' + JSON.stringify(ctx.request.body));
        // console.log(app.config.systems.author);
        // console.log(app.config.systems.version);
        // console.log(app.config.systems.appName);
        
        let router = options.router; //获取放行的路由
        const request = ctx.request;

        if (ctx.session.userInfo || router.find(obj => obj == request.url)) {
            await next();
        } else {
            await ctx.render('user/login.html');
        }
    };
};