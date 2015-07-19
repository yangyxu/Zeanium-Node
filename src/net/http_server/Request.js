/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
   'node:url'
],function (url) {

    return zn.class('Request', {
        events: [ 'data', 'end', 'close' ],
        properties: {
            paths: null,
            query: null,
            dataValue: {
                value: {}
            },
            serverRequest: null
        },
        methods: {
            init: function (serverRequest){
                this.__setRequest(serverRequest);
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
            },
            __setRequest: function (request){
                if(!request){ return false; }
                this._dataAry = [];
                this._dataLength = 0;
                this.serverRequest = request;

                var _self = this;

                request.on('data', function (data) {
                    _self._dataLength += data.length;
                    _self._dataAry.push(data);
                    _self.fire('data', data);
                });

                request.on('end', function () {
                    var _buffer = new Buffer(_self._dataLength),
                        _pos = 0;
                    for (var i = 0, _len = _self._dataAry.length; i < _len; i++) {
                        _dataAry[i].copy(_buffer, _pos);
                        _pos += _self._dataAry[i].length;
                    }
                    _self._dataAry = [];
                    _self._dataLength = 0;
                    _self.fire('end', _buffer);
                });

                request.on('close', function(callback){
                    _self.fire('close', callback);
                });

                _self.__onSetRequest(request);

            },
            __onSetRequest: function (request){
                var _req = request,
                    _parse = url.parse(_req.url, true);

                var _paths = _parse.pathname.split('/');
                _paths.shift();
                if(_paths[0]==''){
                    _paths.shift();
                }
                this.query = _parse.query;
                this.paths = _paths;
                this.uri = '/'+_paths.slice(1).join('/');
                zn.extend(this, _req);
            }
        }
    });

});