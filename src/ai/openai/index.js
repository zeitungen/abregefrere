module.exports = class OpenAI {
    configuration = null;

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

    getClient() {
        return this.client;
    }

    // setters
    setClient(client) {
        this.client = client;
    }

    // interface methods

    async init() {
        const OpenAIClient = await this.importOpenAIClient();
        const client = new OpenAIClient({ apiKey: this.getApiKey() });
        this.setClient(client);
    }

    async prompt(prompt) {
        const response = await this.client.chat.completions.create({
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

    // openai methods

    async importOpenAIClient() {
        return (await import('openai')).default;
    }
}