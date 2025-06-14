const { CookieJar } = require('tough-cookie');
const { readabilize } = require('../readabilize');

class HttpDatasource {
    config = {};
    got = null;
    cookieJar = null;

    constructor(config) {
        this.config = config;
        this.cookieJar = this.createCookieJar();
    }

    // getters

    getGot() {
        return this.got;
    }

    getUrl() {
        return this.config.url;
    }

    getBaseUrl() {
        return this.config.url.split('/').slice(0, 3).join('/');
    }

    getMethod() {
        return this.config.method ?? 'GET';
    }

    getHeaders() {
        return this.config.headers ?? this.createDefaultHeaders();
    }

    getCookieJar() {
        return this.cookieJar;
    }

    getReadabilizer() {
        return this.config.readabilizer;
    }

    // interface
    async init() {
        this.got = await this.importGot();
    }


    async get(retry = true) {
        const got = this.getGot();
        try {
            const response = await got(this.getUrl(), this.createOptions());
            
            // Handle cookies from successful responses
            if (response.headers && response.headers['set-cookie']) {
                await this.handleCookies(response.headers['set-cookie']);
            }
            
            return readabilize(this.getReadabilizer(), response.body);
        } catch(e) {
            console.error(`Error fetching ${this.getUrl()}: ${e.message}`);
            
            // Handle cookies from error responses
            if (e.response && e.response.headers && e.response.headers['set-cookie']) {
                console.log(`Received ${e.response.headers['set-cookie'].length} cookies from error response`);
                await this.handleCookies(e.response.headers['set-cookie']);
                
                if (retry) {
                    console.log(`Retrying request to ${this.getUrl()} with updated cookies`);
                    return this.get(false);
                }
            }
            
            throw new Error(`Error while fetching data from ${this.getUrl()}: ${e.message}`);
        }
    }

    // Helper method to handle cookies
    async handleCookies(cookies) {
        if (!cookies || !cookies.length) return;
        
        try {
            for (const cookie of cookies) {
                await new Promise((resolve, reject) => {
                    this.getCookieJar().setCookie(cookie, this.getBaseUrl(), (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            }
        } catch (err) {
            console.error(`Error setting cookies: ${err.message}`);
        }
    }

    // helpers

    async importGot() {
        return (await import('got')).default;
    }

    createOptions() {
        return {
            method: this.getMethod(),
            headers: this.getHeaders(),
            cookieJar: this.getCookieJar(),
            followRedirect: true,
            retry: { limit: 3 }
        };
    }

    createDefaultHeaders() {
        return {};
    }

    createCookieJar() {
        return this.config.cookieJar ?? new CookieJar();
    }
}

module.exports = HttpDatasource;