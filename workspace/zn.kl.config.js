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
                host: '106.14.41.74',
                user: 'root',
                password: 'Kylin2016',
                database:'zn_kylin',
                port: 3306
            }
        }
    }

});
