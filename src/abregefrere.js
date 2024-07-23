const ai = require('./ai');
const { Baragouiner } = require('./baragouiner');

class AbregeFrere {
    config = null;
    baragouiner = null;
    aiEngine = null;

    constructor(config) {
        this.config = config;
    }

    // getters

    getConfiguration() {
        return this.config;
    }

    getBaragouiner() {
        return this.baragouiner;
    }

    getAiEngine() {
        return this.aiEngine;
    }

    // interface

    async init() {
        this.baragouiner = await this.createBaragouiner();
        this.aiEngine = await this.createAiEngine();
    }

    async fiveDots(datasource, nb = 5) {
        const input = await datasource.get();
        const prompt = await this.getBaragouiner().getFiveDotsPrompt({ input, nb });
        const response = await this.prompt(prompt);
        return this.parseFiveDotsResponse(response);
    }

    // init

    async createBaragouiner() {
        const baragouiner = new Baragouiner(this.config);
        await baragouiner.init();
        return this.baragouiner = baragouiner;
    }

    async createAiEngine() {
        const aiEngine = ai.factory(this.config.getEngine(), this.config.getEngineConfiguration());
        await aiEngine.init();
        return aiEngine;
    }

    // ai

    async prompt(prompt) {
        const response = await this.getAiEngine().prompt(prompt);
        return response;
    }

    // five dots helpers

    parseFiveDotsResponse(response) {
        let parts = response.split(/-{3,}/);
        if (parts.length < 2) {
            parts = response.split('\n\n');
        }
        return {
            fiveDots: parts[0].trim(),
            summary: parts[1]?.trim() ?? '',
        }
    }
}

module.exports = AbregeFrere;