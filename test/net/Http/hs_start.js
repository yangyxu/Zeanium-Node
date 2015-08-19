var zn = require('../../../src/zn');

zn.define([
    'net',
    'node:os',
    './hs_config'
], function (net, os, hs_config) {

    var httpServer = net.http.HttpServer.createServer(hs_config);

}).exec();