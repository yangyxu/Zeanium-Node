/**
 * Created by yangyxu on 7/6/15.
 */
zn.define([
    './Module1.js',
    './Module2.js'
],function (Module1, Module2){
    console.log(Module1._name_);
    console.log(Module2._name_);
    console.log('loading --- module3');
    return zn.class('com.yangyxu.Module3', {
        properties: {
            name: 'module3'
        },
        methods: {
            init: function (){
                console.log(this.name);
            }
        }
    });

});
