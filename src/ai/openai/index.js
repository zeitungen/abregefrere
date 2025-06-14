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

    getSystemMessageContent() {
        return this.getConfiguration().systemMessage || '';
    }

    getClient() {
        return this.client;
    }

    // setters
    setClient(client) {
        this.client = client;
    }
    
    setSystemMessageContent(content) {
        this.configuration.systemMessage = content;
    }

    // interface methods

    async init() {
        const OpenAIClient = await this.importOpenAIClient();
        const client = new OpenAIClient({ apiKey: this.getApiKey() });
        this.setClient(client);
    }

    async prompt(prompt) {
        const messages = [];
        if(this.getSystemMessageContent()) {
            messages.push(this.generateSystemMessage());
        }
        messages.push(this.generatePromptMessage(prompt));

        const response = await this.client.chat.completions.create({
            model: this.getModel(),
            messages: messages
        });
        return response.choices[0].message.content;
    }

    // openai methods

    async importOpenAIClient() {
        return (await import('openai')).default;
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