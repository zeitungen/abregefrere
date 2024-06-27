# abregefrere
AI powered tools for summarizing texts

# example

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
