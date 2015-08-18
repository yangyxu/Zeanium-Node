var zn = require('../../../src/zn');

zn.define([
    'net',
    'node:os'
], function (net, os) {

    var _localhost = os.platform()==='darwin'?'127.0.0.1':'0.0.0.0';


    _localhost = '127.0.0.1';

    var _config =  {
        host: _localhost,
        port: 8888,
        catalog: '/webapps/',
        mode: 'relase',
        __dirname: __dirname
    };

    var httpServer = net.http.HttpServer.createServer(_config);

}).exec();