/**
 * Created by yangyxu on 7/6/15.
 */
zn.define(['./Module3.js'],function (Module1){

    console.log('loading --- module4');
    console.log(Module1._name_);

    return zn.class('com.yangyxu.Module4', {
        properties: {
            name: 'module4'
        },
        methods: {
            init: function (){
                console.log(this.name);
            }
        }
    });

});
