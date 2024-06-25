const Datasource = {
    http: 'HTTP',
}

const instanciateDataSource = (type, config) => {
    switch (type) {
        case Datasource.http:
            const HttpDatasource = require('./http');
            return new HttpDatasource(config);
        default:
            throw new Error('Datasource not found');
    }
};

const dataSourceFactory = async (type, config) => {
    const dataSource = instanciateDataSource(type, config);
    await dataSource.init();
    return dataSource;
}

module.exports = {
    Datasource,
    dataSourceFactory,
}