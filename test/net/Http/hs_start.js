var zn = require('../../../src/zn');

zn.define([
    'net',
    'node:os',
    './hs_config'
], function (net, os, hs_config) {

    console.log(hs_config);

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