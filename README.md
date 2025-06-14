# abregefrere
AI powered tools for summarizing texts

# Example

In this example, we gonna use mistral ai engine

create a `config.json` file

```json
{
    "defaultLanguage": "fr-FR",
    "engine": {
        "name": "mistral",
        "configuration": {
            "apiKey": "your key",
            "model": "open-mixtral-8x22b"
        }
    }
}
```

Vous pouvez également personnaliser le prompt système utilisé par l'IA :

```json
{
    "defaultLanguage": "fr-FR",
    "systemPrompt": "Tu es un assistant spécialisé dans la synthèse de textes français, conçu pour être précis et concis.",
    "engine": {
        "name": "mistral",
        "configuration": {
            "apiKey": "your key",
            "model": "open-mixtral-8x22b"
        }
    }
}
```

```js
const path = require('path');
const { 
    ConfigurationLoader, configFactory,
    Datasource, dataSourceFactory,
    Readabilizer, AbregeFrere
} = require('abregefrere');

(async () => {
    const config = await configFactory(
        ConfigurationLoader.jsonFile,
        { path: path.resolve(__dirname, './config.json')}
    );

    const dataSource = await dataSourceFactory(
        Datasource.http,
        {
            readabilizer: Readabilizer.html,
            url: 'https://fr.wiktionary.org/wiki/baragouiner'
        }
    );

    const abregeFrere = new AbregeFrere(config);
    await abregeFrere.init();
    const response = await abregeFrere.fiveDots(dataSource);
    console.log('fiveDots response:');
    console.log(response.fiveDots);
    console.log('summary:');
    console.log(response.summary);
})();
```

# Development

## Publishing to npm

This package uses GitHub Actions for automated publishing to npm. To release a new version:

1. Make your changes and commit them
2. Run one of the following commands depending on the type of update:
   ```bash
   # For a patch release (0.0.x)
   npm run release
   
   # For a minor release (0.x.0)
   npm run release:minor
   
   # For a major release (x.0.0)
   npm run release:major
   ```

3. The command will:
   - Update the version in package.json
   - Create a git tag
   - Push changes and tags to GitHub

4. The GitHub Action will automatically:
   - Verify that the tag version matches the package.json version
   - Publish the package to npm

## Setting up npm Token

To allow GitHub Actions to publish to npm, you need to add your npm token as a secret:

1. Create an npm token with publish permissions
2. Go to your GitHub repository settings
3. Navigate to "Secrets and variables" > "Actions"
4. Add a new repository secret named `NPM_TOKEN` with your npm token as the value
