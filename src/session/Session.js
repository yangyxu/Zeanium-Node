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
                this.updateId();
                this._name = name;
                this._cookie = cookie||{};
            },
            setCookie: function (key, value){
                this._cookie[key] = value;
            },
            generateId: function (){
                var _currDate = (new Date()).valueOf().toString(),
                    _random = Math.random().toString();
                return crypto.createHash('sha1').update(_currDate + _random).digest('hex');
            },
            updateId: function (){
                this._id = this.generateId();
            },
            serialize: function (){
                var _pairs = [this._name + '=' + encodeURIComponent(this._id)];
                var _cookie = this._cookie;
                if (_cookie.maxAge) _pairs.push('Max-Age=' + _cookie.maxAge);
                if (_cookie.domain) _pairs.push('Domain=' + _cookie.domain);
                if (_cookie.path) _pairs.push('Path=' + _cookie.path);
                if (_cookie.expires) _pairs.push('Expires=' + _cookie.expires);
                if (_cookie.httpOnly) _pairs.push('HttpOnly');
                if (_cookie.secure) _pairs.push('Secure');


                return _pairs.join('; ');
            }
        }
    });

});
