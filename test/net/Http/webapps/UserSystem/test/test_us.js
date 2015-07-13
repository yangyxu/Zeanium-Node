zn.define([
    'unit'
], function (unit) {

    var loader = unit.TestLoader;
    loader.load('./TestUser');
    //loader.load('./TestVar');
    loader.run();

});
