zn.define({
    deploy: 'oa',
    controllers: '/controller/',
    views: {
        path: '/view/',
        suffix: 'html'
    },
    statics: [
        '/resources/*'
    ],
    session: {
        name: '',
        timeout: ''
    },
    databases: {
        'local_mysql': {
            type: 'mysql',
            host: '127.0.0.1',
            user: 'root',
            password: '123456',
            database:'jpdy',
            port: 3306,
            multipleStatements: true
        },
        'local_mongo': {
            type: 'mongo',
            host: '127.0.0.1',
            user: 'root',
            password: '123456',
            database:'mongo',
            port: 27017
        }
    }
});