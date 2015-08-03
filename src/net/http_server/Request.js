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
            query: {
                value: {}
            },
            serverRequest: null
        },
        methods: {
            init: function (serverRequest){
                this._getData = {};
                this._postData = {};
                this.__setRequest(serverRequest);
            },
            getValue: function (inName) {
                return this._getData[inName];
            },
            setValue: function (inKey, inValue){
                return this._getData[inKey] = inValue, this;
            },
            getErrorMessage: function (){
                return this._ERROR_MESSAGE;
            },
            setErrorMessage: function (inValue){
                return this._ERROR_MESSAGE = inValue, this;
            },
            getInt: function (inName) {
                return +(this.getValue(inName));
            },
            getBoolean: function (inName) {
                return new Boolean(this.getValue(inName)).valueOf();
            },
            checkArgs: function (args, response){
                var _defaultValue = null,
                    _newValue = null,
                    _values = zn.extend({}, this.query, this._postData);

                for(var _key in args){
                    _defaultValue = args[_key];
                    _newValue = _values[_key];

                    if (_defaultValue === undefined && _newValue === undefined){
                        response.error('The value of ' + _key + ' is Required.');
                        return false;
                    }
                    if(zn.type(_defaultValue)=='object'){
                        var _value = _defaultValue.value,
                            _reg = _defaultValue.regexp;
                        if(!_reg.test(_value)){
                            response.error('The value of ' + _key + ' is Invalid.');
                            return false;
                        }
                    }

                    if(_newValue === undefined && _defaultValue){
                        _values[_key] = _defaultValue;
                    }
                }

                return this._getData = _values, _values;
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
                        _self._dataAry[i].copy(_buffer, _pos);
                        _pos += _self._dataAry[i].length;
                    }
                    _self._dataAry = [];
                    _self._dataLength = 0;
                    //console.log(_buffer.toString("utf-8"));
                    //console.log(_buffer);
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