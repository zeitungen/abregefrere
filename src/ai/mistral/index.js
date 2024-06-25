module.exports = class Mistral {
    configuration = null;
    client = null;

    constructor(configuration) {
        this.configuration = configuration;
    }

    // getters
    getConfiguration() {
        return this.configuration;
    }

    getApiKey() {
        return this.getConfiguration().apiKey;
    }

    getModel() {
        return this.getConfiguration().model;
    }

    // setters
    setClient(client) {
        this.client = client;
    }

    // interface methods

    async init() {
        const MistralClient = await this.importMistrallClient();
        const client = new MistralClient(this.getApiKey());
        this.setClient(client);
    }

    async prompt(prompt) {
        const response = await this.client.chat({
            model: this.getModel(),
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ]
        });
        return response.choices[0].message.content;
    }

    // mistral ai methods

    async importMistrallClient() {
        return (await import('@mistralai/mistralai')).default;
    }
} 