zn.define(function (){

    return {
        host: '0.0.0.0',
        port: 8989,
        catalog: '/',
        mode: 'debug',     //release, debug, view,
        indexs: ['index.html', 'index.htm', 'default.html', 'default.htm'],
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
    }

});
