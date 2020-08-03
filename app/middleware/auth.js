'use strict';

module.exports = (options, app) => {

    return async function WebAuthentication(ctx, next) {

        let result = {
            code: ctx.TOKEN,
            message: "请求错误",
        };
        try {

            let request = ctx.request;
            let token = request.header.authorization;
            let router = options.router;
            let jwt = options.jwt;
            let secret = options.secret;
            if (router.find(obj => obj == request.url) || (token && await jwt.verify(token.split(' ')[1], secret))) {
                await next();
            } else {
                ctx.body = result;
            }
        } catch (e) {
            result.message = e.message;
            ctx.body = result;
        }
    };
};