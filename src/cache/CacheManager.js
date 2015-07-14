/**
 * Created by yangyxu on 7/14/15.
 */
zn.define([
    './Cache'
],function (Cache) {

    return zn.class('CacheManager', {
        static: true,
        properties: {
            all: []
        },
        methods: {
            init: function (){

            },
            createCache: function (objs){
                var _cache = new Cache(objs);
                this.all.push(_cache);
                return _cache;
            },
            size: function (){
                return this.all.length;
            }
        }
    });

});