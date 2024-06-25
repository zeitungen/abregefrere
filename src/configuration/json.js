const fs = require('fs/promises')

class JsonConfig {
    json = null;
    parsed = null;

    constructor(options) {
        this.json = options.json;
    }

    async init() {
        this.parsed = JSON.parse(this.json);
    }

    // getters

    getDefaultLang() {
        return this.parsed.defaultLang ?? 'fr-FR';
    }

    getEngine() {
        return this.parsed.engine.name;
    }

    getEngineConfiguration() {
        return this.parsed.engine.configuration;
    }
}

class JsonFileConfig extends JsonConfig {
    path = null;

    constructor(options) {
        super(options);
        this.path = options.path;
    }

    async init() {
        this.json = await fs.readFile(this.path, 'utf8');
        await super.init();
    }
}

module.exports = {
    JsonConfig,
    JsonFileConfig
};