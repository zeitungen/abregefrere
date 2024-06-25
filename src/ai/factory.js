const ENGINE = require('./engine');

module.exports = function factory(engine, conf) {
    switch (engine) {
        case ENGINE.mistral:
            const Mistral = require('./mistral');
            return new Mistral(conf);
        default:
            throw new Error(`Engine ${engine} not supported`);
    }
}