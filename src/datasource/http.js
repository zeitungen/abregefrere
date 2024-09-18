const { readabilize } = require('../readabilize');

class HttpDatasource {
    config = {};
    got = null;

    constructor(config) {
        this.config = config;
    }

    // getters

    getGot() {
        return this.got;
    }

    getUrl() {
        return this.config.url;
    }

    getMethod() {
        return this.config.method ?? 'GET';
    }

    getHeaders() {
        return this.config.headers ?? this.createDefaultHeaders();
    }

    getReadabilizer() {
        return this.config.readabilizer;
    }

    // interface
    async init() {
        this.got = await this.importGot();
    }


    async get() {
        const got = this.getGot();
        const response = await got(this.getUrl(), this.createOptions());
        return readabilize(this.getReadabilizer(), response.body);
    }

    // helpers

    async importGot() {
        return (await import('got')).default;
    }

    createOptions() {
        return {
            method: this.getMethod(),
            headers: this.getHeaders(),
        };
    }

    createDefaultHeaders() {
        return {};
    }
}

module.exports = HttpDatasource;