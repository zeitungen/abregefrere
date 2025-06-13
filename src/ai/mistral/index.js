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

    getSystemMessageContent() {
        return this.getConfiguration().systemMessage || '';
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
        const messages = [];
        if(this.getSystemMessageContent()) {
            messages.push(this.generateSystemMessage());
        }
        messages.push(this.generatePromptMessage(prompt));

        const response = await this.client.chat({
            model: this.getModel(),
            messages: messages,
        });
        return response.choices[0].message.content;
    }

    // mistral ai methods

    async importMistrallClient() {
        return (await import('@mistralai/mistralai')).default;
    }

    generatePromptMessage(prompt) {
        return {
            role: 'user',
            content: prompt
        };
    }

    generateSystemMessage() {
        return {
            role: 'system',
            content: this.getSystemMessageContent()
        };
    }
} 