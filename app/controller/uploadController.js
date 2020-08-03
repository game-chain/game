'use strict';

const Controller = require('../core/baseController');
const fs = require('mz/fs');
const pump = require('pump');

class uploadController extends Controller {

    async upload() {
        const {ctx} = this;
        const parts = ctx.multipart({autoFields: true});
        let files = {};
        let stream;
        while ((stream = await parts()) != null) {
            if (!stream.filename) {
                break;
            }
            const dir = await ctx.helper.getUploadFile(stream.filename);
            const target = dir.uploadDir;
            const writeStream = fs.createWriteStream(target);
            await pump(stream, writeStream);
            files = Object.assign(files, {
                path: dir.saveDir,
            });
            //this.ctx.service.nodeInfoService.update(bp_name, {icon: files.path});
            this.success(files);
        }
    }
}

module.exports = uploadController;
