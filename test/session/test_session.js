var zn = require('../../src/zn');

zn.define([
    'cache'
], function (cache) {
    var _cacheManager = cache.CacheManager;
    var _cache = _cacheManager.createCache();

    _cache.set('yangyxu', 'yangyxu@cisco.com');
    _cache.get('yangyxu').then(function (value){
        console.log(value);
    })
    console.log(zn.uuid());
    //console.log(session);

}).exec();