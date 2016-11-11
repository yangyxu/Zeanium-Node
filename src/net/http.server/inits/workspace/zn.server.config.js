zn.define(function (){

    return {
        host: '0.0.0.0',
        port: 8888,
        catalog: '/',
        mode: 'debug',     //release, debug, view,
        indexs: ['index.html', 'index.htm', 'default.html', 'default.htm'],
        databases: {
            'mysql': {
                default: true,
                type: 'mysql',
                host: '127.0.0.1',
                user: 'root',
                password: '123456',
                database:'zn_app',
                port: 3306
            }
        }
    }

});
