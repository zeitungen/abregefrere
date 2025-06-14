class JsObjectConfig {
    data = null;

    constructor(options) {
        this.data = options;
    }

    async init() {
        // nothing to do here..
        // but it's needed to keep the same interface as other configuration classes
    }

    // getters

    getDefaultLang() {
        return this.data.defaultLang ?? 'fr-FR';
    }

    getEngine() {
        return this.data.engine.name;
    }

    getEngineConfiguration() {
        return this.data.engine.configuration;
    }
    
    getSystemPrompt() {
        return this.data.systemPrompt;
    }
}

module.exports = { JsObjectConfig };