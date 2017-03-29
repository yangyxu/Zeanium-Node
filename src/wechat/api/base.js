zn.define({
    token: {
        url: '/token',
        method: 'GET',
        argv: {
            grant_type: 'client_credential',
            appid: null,
            secret: null
        }
    },
    getcallbackip: {
        url: '/getcallbackip',
        method: 'GET',
        argv: {
            access_token: null
        }
    }
});
