zn.define({
    deploy: '__YourAppName__',
    controllers: '/server/controller/',
    views: {
        path: '/web/view/',
        suffix: 'html'
    },
    session: {
        name: '',
        timeout: ''
    },
    databases: {
        'mysql': {
            type: 'mysql',
            host: '127.0.0.1',
            user: 'root',
            password: '123456',
            database:'zn_mysql',
            port: 3306
        },
        'mongo': {
            type: 'mongo',
            host: '127.0.0.1',
            user: 'root',
            password: '123456',
            database:'zn_mongo',
            port: 27017
        }
    }
});
