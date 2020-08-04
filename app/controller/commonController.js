'use strict';

const Controller = require('../core/baseController');

class commonController extends Controller {

    /**
     * 交易记录
     * @returns {Promise<void>}
     */
    async transfer() {
        await this.ctx.render('transfer/transfer.html');
    }

    async transferData() {
        const query = this.ctx.query;
        let url = this.app.config.eos.gameApi + 'nos-iot/v1/noschain/GetTransactionsForExplore';
        let result = await this.ctx.curl(url, {
            method: "GET",
            dataType: "json",
            data: {
                account: 'gamevpay1111',
                page: ''
            },
            timeout: 50000
        });
        //result = await this.ctx.service.dividendService.list([], (query.start) / query.length, parseInt(query.length));
        result.count = result.data.Data.length;
        result.rows = result.data.Data;
        this.success(result);
    }
}

module.exports = commonController;
