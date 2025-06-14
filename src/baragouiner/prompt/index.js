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

    async getSystemTemplate() {
        // Si un system prompt est défini dans la configuration, on l'utilise
        const configSystemPrompt = this.config.getSystemPrompt?.();
        if (configSystemPrompt) {
            return configSystemPrompt;
        }
        // Sinon, on utilise celui défini dans le fichier de prompts
        return this.prompts.system;
    }

    async getFiveDotsTemplate() {
        return this.prompts.fiveDots;
    }

    async getFiveTagsTemplate() {
        return this.prompts.fiveTags;
    }
    
    async getSummaryTemplate() {
        return this.prompts.summary;
    }
    
    async getSimplifyTemplate() {
        return this.prompts.simplify;
    }
    
    async getCritiqueTemplate() {
        return this.prompts.critique;
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