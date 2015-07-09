/**
 * Created by yangyxu on 7/9/15.
 */


var zn = require('../../src/zn');
zn.GLOBAL.zn = zn;
console.log('test before');
zn.module([
    'util'
], function (unit) {

    console.log(this);
    console.log(this.Util);
    //console.log(unit);
    /*
    var loader = unit.TestLoader;
    loader.load('./TestUser');
    loader.load('./TestRole');
    loader.load('./TestAdmin');
    loader.run();*/

}).exec();
console.log('test after');
