/**
 * Created by yangyxu on 7/6/15.
 */
console.log(zn);
zn.define(function (){
    console.log('loading --- module1');

    return zn.class('com.yangyxu.Module1', {
        properties: {
            name: 'module1'
        },
        methods: {
            init: function (){
                console.log(this.name);
            }
        }
    });

});
