const ENGINE = require('./engine');

module.exports = function factory(engine, conf) {
    switch (engine) {
        case ENGINE.mistral:
            const Mistral = require('./mistral');
            return new Mistral(conf);
        case ENGINE.openai:
            const OpenAI = require('./openai');
            return new OpenAI(conf);
        default:
            throw new Error(`Engine ${engine} not supported`);
    }
}