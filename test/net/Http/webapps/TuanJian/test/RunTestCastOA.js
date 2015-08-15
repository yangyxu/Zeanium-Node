var zn = require('../../../../../../src/zn');

zn.define(function () {

    var testLoader = zn.unit.TestLoader;

    testLoader.basePath = __dirname;

    testLoader.load('/TestRole');

    //testLoader.load('./TestVar');

    testLoader.run();

}).exec();
