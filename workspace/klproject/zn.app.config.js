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
    }
});
