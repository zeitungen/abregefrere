const { JsObjectConfig } = require('./jsobject');
const { JsonConfig, JsonFileConfig } = require('./json');

const ConfigurationLoader = {
    object: 'object',
    json: 'json',
    jsonFile: 'jsonFile',
};

const createConfig = async (type, config) => {
    switch (type) {
        case ConfigurationLoader.json:
            return new JsonConfig(config);
        case ConfigurationLoader.jsonFile:
            return new JsonFileConfig(config);
        case ConfigurationLoader.object:
        default:
            return new JsObjectConfig(config);
    }
};

const configFactory = async (type, config) => {
    if(typeof type !== 'string') {
        config = type;
        type = ConfigurationLoader.object;
    }

    const configInstance = await createConfig(type, config);
    await configInstance.init();
    return configInstance;
}

module.exports = {
    ConfigurationLoader,
    configFactory
};