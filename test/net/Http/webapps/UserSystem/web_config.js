zn.define({
    deploy: 'us',
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
    mysql: {
        dbType: 'mysql',
        host: '127.0.0.1',
        user: 'root',
        password: '123456',
        database:'jpdy',
        port: 3306
    },
    databases: {
        'local_mysql': {
            type: 'mysql',
            host: '127.0.0.1',
            user: 'root',
            password: '123456',
            database:'jpdy',
            port: 3306
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