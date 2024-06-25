const fs = require('fs/promises');
const path = require('path');

class PromptEngine {
    config = null;
    prompts = {};
  
    constructor(config) {
        this.config = config;
    }

    getConfig() {
        return this.config;
    }

    getLang() {
        return this.config.getDefaultLang();
    }

    // interface

    async init() {
        const lang = this.getLang();
        this.prompts = await this.loadPrompts(lang);
    }

    async getFiveDotsTemplate() {
        return this.prompts.fiveDots;
    }

    // init helpers

    getLangFilepath(lang) {
        return path.resolve(__dirname, this.getLangFilename(lang));
    }

    getLangFilename(lang) {
        lang = lang.split('-')[0];
        return `${lang}.json`;
    }

    async loadPrompts(lang) {
        const data = await fs.readFile(this.getLangFilepath(lang), 'utf8');
        const res = JSON.parse(data);
        return res;
    }
}

module.exports = PromptEngine;