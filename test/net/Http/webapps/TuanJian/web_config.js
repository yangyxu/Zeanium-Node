zn.define({
    deploy: 'tj',
    controllers: '/controller/',
    views: {
        path: '/view/',
        suffix: 'html'
    },
    statics: [
        '/resources/*',
        '/uploads/catalog/*'
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
            password: 'yangyxu',
            database:'tuanjian',
            port: 3306
        },
        'local_mongo': {
            type: 'mongo',
            host: '127.0.0.1',
            user: 'root',
            password: '123456',
            database:'tuanjian',
            port: 27017
        }
    }
});