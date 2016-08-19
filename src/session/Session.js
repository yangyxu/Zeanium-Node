/**
 * Created by yangyxu on 7/14/15.
 */
zn.define(['node:crypto'], function (crypto) {

    return zn.Class('Session', {
        properties: {
            id: null,
            name: null,
            cookie: null
        },
        methods: {
            init: function (name, cookie){
                this._createdTime = new Date();
                this._name = name;
                this._cookie = cookie||{};
                this._data = {};
                this._id = this.generateId();
            },
            setCookie: function (key, value){
                this._cookie[key] = value;
            },
            getCreatedTime: function (){
                return this._createdTime;
            },
            getLastAccessedTime: function (){
                return this._updatedTime;
            },
            getExpiresTime: function (){
                return this._expiresTime;
            },
            getId: function (){
                return this._id;
            },
            setItem: function (name, value){
                this._data[name] = value;
            },
            getItem: function (name){
                return this._data[name];
            },
            getItems: function (){
                return this._data;
            },
            getKeys: function (){
                return Object.keys(this._data);
            },
            hasItem: function (){
                return !!this.getKeys().length;
            },
            isNew: function (){
                return !!!this._updatedTime;
            },
            generateId: function (){
                var _currDate = (new Date()).valueOf().toString(),
                    _random = Math.random().toString();
                if(this._cookie.maxAge){
                    this._expiresTime = (new Date()).getTime() + this._cookie.maxAge;
                }

                return crypto.createHash('sha1').update(_currDate + _random).digest('hex');
            },
            updateId: function (){
                this._id = this.generateId();
                this._updatedTime = new Date();
            },
            serialize: function (){
                var _pairs = [this._name + '=' + encodeURIComponent(this._id)];
                var _cookie = this._cookie;
                if(!_cookie.expires && this._expiresTime) {
                    _cookie.expires = this._expiresTime;
                }
                if (_cookie.maxAge) _pairs.push('Max-Age=' + _cookie.maxAge);
                if (_cookie.domain) _pairs.push('Domain=' + _cookie.domain);
                if (_cookie.path) _pairs.push('Path=' + _cookie.path);
                if (_cookie.expires) _pairs.push('Expires=' + (new Date(_cookie.expires).toISOString()));
                if (_cookie.httpOnly) _pairs.push('HttpOnly');
                if (_cookie.secure) _pairs.push('Secure');


                return _pairs.join('; ');
            }
        }
    });

});
