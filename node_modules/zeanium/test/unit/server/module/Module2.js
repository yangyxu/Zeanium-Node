/**
 * Created by yangyxu on 7/6/15.
 */
zn.module(function (){
    console.log('loading --- module2');
    return zn.class('com.yangyxu.Module2', {
        properties: {
            name: 'module2'
        },
        methods: {
            init: function (){
                console.log(this.name);
            }
        }
    });

});
