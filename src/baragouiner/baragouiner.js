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

    async getSystemPrompt() {
        return await this.prompt.getSystemTemplate();
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

    async getFiveTags(params) {
        const template = await this.prompt.getFiveTagsTemplate();

        if(!params.nb) {
            params.nb = 5;
        }

        if(params.input === undefined) {
            params.input = '';
        }

        return this.render(template, params);
    }
    
    async getSummary(params) {
        const template = await this.prompt.getSummaryTemplate();
        
        if(!params.nbWords) {
            params.nbWords = 150;
        }
        
        if(params.input === undefined) {
            params.input = '';
        }
        
        return this.render(template, params);
    }
    
    async getSimplify(params) {
        const template = await this.prompt.getSimplifyTemplate();
        
        if(!params.level) {
            params.level = 3;
        }
        
        if(params.input === undefined) {
            params.input = '';
        }
        
        return this.render(template, params);
    }
    
    async getCritique(params) {
        const template = await this.prompt.getCritiqueTemplate();
        
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