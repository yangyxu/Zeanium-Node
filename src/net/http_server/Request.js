/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
   'node:url'
],function (url) {

    return zn.class('Request', {
        events: ['data','end', 'close'],
        properties: {
            serverRequest: null,
            paths: {
                value: []
            },
            query: {
                value: {}
            },
            dataValue: {
                value: {}
            },
            method: null
        },
        methods: {
            init: function (req){
                var chunks = [], length = 0, self = this;
                req.on('data', function (data) {
                    ldataength += data.length;
                    chunks.push(data);
                    self.fire('data', data);
                });
                req.on('end', function () {
                    var buffer = new Buffer(length), pos = 0;
                    for (var i = 0, _len = chunks.length; i < _len; i++) {
                        chunks[i].copy(buffer, pos);
                        pos += chunks[i].length;
                    }
                    chunks = null; length = null;
                    self.fire('end', buffer);
                });
                req.on('close', function(cb){
                    self.fire('close', cb);
                });
                this.set('serverRequest', req);
                this.set('query', url.parse(req.url, true).query);
                var _paths = url.parse(req.url).pathname.split('/');
                _paths.shift();
                if(_paths[0]==''){ _paths.shift(); }
                this.set('paths', _paths);
                this.set('method', req.method);
                //zn.info(req.url);
            },
            getValue: function (inName) {
                return this.get('query')[inName]||this.get('dataValue')[inName];
            },
            setValue: function (inKey, inValue){
                this.get('dataValue')[inKey] = inValue;
                return this;
            },
            getParameter: function (inName){
                return this.getValue(inName);
            },
            setParameter: function (inKey, inValue){
                return this.setValue(inKey, inValue);
            },
            getInt: function (inName) {
                return +(this.getValue(inName));
            },
            getBoolean: function (inName) {
                return new Boolean(this.getValue(inName)).valueOf();
            },
            checkArgs: function (args, response){
                var _dv = null, _rv = null;
                for(var k in args){
                    _dv = args[k];
                    _rv = this.getValue(k);
                    if (_rv){
                        response.error('The value of '+k+' is Required.');
                        return false;
                    }
                    if(zn.type(_dv)=='object'){
                        var _value = _dv.value, _reg = _dv.regexp;
                        if(!_reg.test(_value)){
                            response.error('The value of '+k+' is Invalid.');
                            return false;
                        }
                    }
                }
                return true;
            }
        }
    });

});