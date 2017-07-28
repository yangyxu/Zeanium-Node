/**
 * Created by yangyxu on 7/6/15.
 */
module("require");


zn.module([
    'core/test.js',
    'core/test1.js'
], function (){

});

zn.module([
    'core/test.js'
], function (){

});

zn.module('core/test.js', function (){

});

zn.module(function (){

});

