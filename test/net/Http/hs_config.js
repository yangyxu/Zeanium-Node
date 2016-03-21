zn.define([
    'node:os'
], function (os){

    var _localhost = os.platform()==='darwin'?'127.0.0.1':'0.0.0.0';

    return {
        host: _localhost,
        port: 9999,
        catalog: '/webapps/',
        mode: 'release',
        __dirname: __dirname
    };

});