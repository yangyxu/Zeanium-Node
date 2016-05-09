/**
 * Created by yangyxu on 7/14/15.
 */
zn.define([
    'cache'
],function (cache) {

    var Cache = cache.Cache;

    return zn.Class('Session', Cache, {
        properties: {

        },
        methods: {
            init: function (objs){
                this.sets(objs);
                this.super(objs);
            }
        }
    });

});
