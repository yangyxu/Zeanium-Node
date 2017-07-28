/**
 * Created by yangyxu on 7/6/15.
 */
var zn = require('../../../dest/js/zn');
zn.GLOBAL.zn = zn;

zn.load('./module/Module1.js', function (Module4){
    console.log(Module4._name_);
    console.log(Module4);
});