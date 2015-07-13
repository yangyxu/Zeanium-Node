/**
 * Created by yangyxu on 7/9/15.
 */


var zn = require('../../src/zn');

zn.define([
    'net'
], function (net) {

    var server = new net.http.HttpServer();
    //zn.info('test');
    console.log(Object.keys(net.http));

}).exec();

