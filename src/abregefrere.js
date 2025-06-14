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
        
        // Définir le message système pour les moteurs d'IA
        const systemPrompt = await this.getBaragouiner().getSystemPrompt();
        if (this.aiEngine.setSystemMessageContent) {
            this.aiEngine.setSystemMessageContent(systemPrompt);
        } else {
            // Mettre à jour la configuration pour inclure le message système
            const engineConfig = this.config.getEngineConfiguration();
            engineConfig.systemMessage = systemPrompt;
        }
    }

    async fiveDots(datasource, nb = 5) {
        const input = await datasource.get();
        const prompt = await this.getBaragouiner().getFiveDotsPrompt({ input, nb });
        const response = await this.prompt(prompt);
        return this.parseFiveDotsResponse(response);
    }

    async fiveTags(datasource, nb = 5) {
        const input = await datasource.get();
        const prompt = await this.getBaragouiner().getFiveTags({ input, nb });
        const response = await this.prompt(prompt);
        return this.parseFiveTagsResponse(response);
    }
    
    async summary(datasource, nbWords = 150) {
        const input = await datasource.get();
        const prompt = await this.getBaragouiner().getSummary({ input, nbWords });
        const response = await this.prompt(prompt);
        return { summary: response };
    }
    
    async simplify(datasource, level = 3) {
        const input = await datasource.get();
        const prompt = await this.getBaragouiner().getSimplify({ input, level });
        const response = await this.prompt(prompt);
        return { simplified: response };
    }
    
    async critique(datasource) {
        const input = await datasource.get();
        const prompt = await this.getBaragouiner().getCritique({ input });
        const response = await this.prompt(prompt);
        return this.parseCritiqueResponse(response);
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

    // helpers

    parseFiveDotsResponse(response) {
        return JSON.parse(response);
    }

    parseFiveTagsResponse(response) {
        return {
            tags: response.split(',').map(tag => tag.trim()),
        }
    }
    
    parseCritiqueResponse(response) {
        return JSON.parse(response);
    }
}

module.exports = AbregeFrere;