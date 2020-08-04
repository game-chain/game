'use strict';

const Service = require('egg').Service;

/**
 * @explain 配置文件
 * @author xiaoping
 * @date 2020.3.26
 */
class adminUserService extends Service {

    /**
     * 查询后台信息
     * @param name
     * @returns {Promise<*>}
     */
    async find(name, password) {
        password = this.ctx.helper.encryption(password);
        return await this.ctx.model.AdminUser.findOne({
            where: {
                name: name,
                password: password
            }
        });
    }

    /**
     * 更新
     * @param id
     * @param updates
     * @returns {Promise<*>}
     */
    async update(name, password) {
        password = this.ctx.helper.encryption(password);
        const user = await this.ctx.model.AdminUser.findOne({
            where: {
                name: name
            }
        })
        if (!user) {
            return false;
        }
        return await user.update({password: password});
    }
}

module.exports = adminUserService;
