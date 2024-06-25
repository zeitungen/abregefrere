const { JsonConfig, JsonFileConfig } = require('./json');

const ConfigurationLoader = {
    json: 'json',
    jsonFile: 'jsonFile',
};

const createConfig = async (type, config) => {
    switch (type) {
        case ConfigurationLoader.json:
            return new JsonConfig(config);
        case ConfigurationLoader.jsonFile:
            return new JsonFileConfig(config);
        default:
            throw new Error('Unknown configuration loader type');
    }
};

const configFactory = async (type, config) => {
    const configInstance = await createConfig(type, config);
    await configInstance.init();
    return configInstance;
}

module.exports = {
    ConfigurationLoader,
    configFactory
};