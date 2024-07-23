const mustache = require('mustache');
const PromptEngine = require('./prompt');

class Baragouiner {
    config = null;
    prompt = null;

    constructor(config) {
        this.config = config;
        this.prompt = new PromptEngine(config);
    }

    getConfig() {
        return this.config;
    }

    // interface

    async init() {
        await this.prompt.init();
    }

    async getFiveDotsPrompt(params) {
        const template = await this.prompt.getFiveDotsTemplate();

        if(!params.nb) {
            params.nb = 5;
        }

        if(params.input === undefined) {
            params.input = '';
        }

        return this.render(template, params);
    }

    // template helpers

    async render(template, data) {
        return  mustache.render(template, data);
    }
}

module.exports = Baragouiner;