var zn = require('../../../src/zn.minx');

zn.define([
    'net',
    './hs_config'
], function (net, hs_config) {

    var httpServer = net.http.HttpServer.createServer(hs_config);

}).exec();