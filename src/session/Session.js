/**
 * Created by yangyxu on 7/14/15.
 */
zn.define([
    '../cache/index.js'
],function (cache) {

    var Cache = cache.Cache;

    return zn.Class('Session', Cache, {
        properties: {

        },
        methods: {
            init: function (objs){
                this.sets(objs);
                this.super(objs);
            },
            serialize: function (name, value, option){
                var _pairs = [name + '=' + encodeURIComponent(value)];
                var _option = option || {};
                if (_option.maxAge) _pairs.push('Max-Age=' + _option.maxAge);
                if (_option.domain) _pairs.push('Domain=' + _option.domain);
                if (_option.path) _pairs.push('Path=' + _option.path);
                if (_option.expires) _pairs.push('Expires=' + _option.expires);
                if (_option.httpOnly) _pairs.push('HttpOnly');
                if (_option.secure) _pairs.push('Secure');

                return _pairs.join('; ');
            }
        }
    });

});
