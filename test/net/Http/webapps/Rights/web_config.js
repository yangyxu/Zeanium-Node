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
        dbType:'mysql',
        host: '127.0.0.1',
        user: 'root',
        password: '123456',
        password: '123456',
        database:'jpdy',
        port: 3306
    }
});