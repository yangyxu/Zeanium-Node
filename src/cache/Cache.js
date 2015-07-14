/**
 * Created by yangyxu on 7/14/15.
 */
zn.define([
    'node:redis'
],function (redis) {

    return zn.class('Cache', {
        properties: {
            ip: '127.0.0.1',
            port: 6379,
            name: '_cache'
        },
        methods: {
            init: function (objs){
                this.sets(objs);
                this._client = redis.createClient(this.port, this.ip);
                this._client.on("connect", this.__onClientConnect.bind(this));
                this._client.on("error", this.__onClientError);
            },
            close: function (){
                this._client.quit(function (err, res) {
                    zn.info('Cache Client ' + this.name + ' Exited.');
                });
            },
            set: function (key, value){
                return this._client.set(key, value), this;
            },
            get: function (key, callback){
                var _defer = zn.async.defer();
                this._client.get(key, function (err, reply){
                    if(reply) {
                        _defer.resolve(reply);
                    } else {
                        _defer.reject(err);
                    }
                });

                return _defer.promise;
            },
            __onClientError: function (err){
                zn.error('Cache Client Error: ' + err);
            },
            __onClientConnect: function (){
                zn.info('Cache Client Connect: ' + this.name);
            }
        }
    });

});