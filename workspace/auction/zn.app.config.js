zn.define({
    models: '/src/model/',
    controllers: '/src/controller/',
    views: {
        path: '/src/view/',
        suffix: 'html'
    },
    session: {
        cookie: {
            maxAge: 60 * 60 * 1000,
            path: '/',
            expires: '',
            httpOnly: true,
            secure: false
        }
    },
    databases: {
        'mysql': {
            default: true,
            type: 'mysql',
            host: '120.55.85.162',
            user: 'root',
            password: 'youyang2016',
            database:'zn_auction',
            port: 3306
        }
    }
});
