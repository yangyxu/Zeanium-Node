(function (zn) {

    var HttpRequest = zn.Class({
        events: [
            'init',
            'validate',
            'before',
            'success',
            'error',
            'complete',
            'after'
        ],
        properties: {
            url: null,
            data: null,
            method: 'POST',
            headers: null
        },
        methods: {
            init: function (url, data, method, headers) {
                this.sets({
                    url: url,
                    data: data,
                    method: method,
                    headers: headers
                });

                this.fire('init', this.gets());
            },
            validateArgv: function (url, data, method, headers){
                var _url = url || this._url || '',
                    _data = data || this._data || {},
                    _method = method || this._method || 'POST',
                    _headers = headers || this._headers || {};

                var _args = {
                    url: _url,
                    data: _data,
                    method: _method,
                    headers: _headers
                };
                return _args;
                /*
                var _result = this.fire('validate', _args);
                if(_result !== null && _result !== undefined){
                    return _result;
                }else {
                    return _args;
                }*/
            },
            exec: function (url, data, method, headers){
                var _argv = this.validateArgv(url, data, method, headers);
                var _result = Store.fire('before', _argv);
                if(_result===false){
                    return false;
                }
                _result = this.fire('before', _argv);
                if(_result===false){
                    return false;
                }

                return _argv;
            },
            __onComplete: function (data){
                var _result = Store.fire('after', data);
                if(_result===false){
                    return false;
                }
                _result = this.fire('complete', data);
                if(_result===false){
                    return false;
                }
            },
            __onSuccess: function (data, xhr){
                var _result = Store.fire('success', data, xhr);
                if(_result===false){
                    return false;
                }
                _result = this.fire('success', data, xhr);
                if(_result===false){
                    return false;
                }
            },
            __onError: function (xhr){
                var _result = Store.fire('success', xhr);
                if(_result===false){
                    return false;
                }
                _result = this.fire('success', xhr);
                if(_result===false){
                    return false;
                }
            },
            refresh: function (url, data, method, headers){
                return this.exec(url, data, method, headers);
            },
            clone: function (data){
                var _data = this._data;
                if(typeof _data === 'object'){
                    _data = zn.extend(JSON.parse(JSON.stringify(_data)), data);
                }else {
                    _data = data;
                }

                return new this.constructor(this._url, _data, this._method, this._headers);
            },
            extend: function (value){
                return this._data = zn.extend(this._data, value), this;
            },
            overwrite: function (value){
                return this._data = zn.overwrite(this._data, value), this;
            }
        }
    });

    var XHR = zn.Class(HttpRequest, {
        methods: {
            init: function (url, data, method, headers){
                this.sets({
                    url: url,
                    data: data,
                    method: method,
                    headers: headers
                });

                this.fire('init', this.gets());
                //this.super(url, data, method, headers);
            },
            exec: function (url, data, method, headers){
                //var _argv = this.super(url, data, method, headers);

                var _argv = this.validateArgv(url, data, method, headers);
                var _result = Store.fire('before', _argv);
                if(_result===false){
                    return false;
                }
                _result = this.fire('before', _argv);
                if(_result===false){
                    return false;
                }

                if(_argv===false){
                    return false;
                }

                return zn.http[_argv.method.toLowerCase()]({
                    url: Store.fixURL(_argv.url),
                    data: _argv.data,
                    headers: _argv.headers,
                    success: function (sender, data, xhr){
                        this.__onSuccess(data, xhr);
                    }.bind(this),
                    error: function (sender, xhr){
                        this.__onError(xhr);
                    }.bind(this),
                    complete: function (sender, xhr){
                        this.__onComplete(xhr);
                    }.bind(this)
                });
            }
        }
    });

    var Fetcher = zn.Class(HttpRequest, {
        methods: {
            init: function (url, data, method, headers){
                this.sets({
                    url: url,
                    data: data,
                    method: method,
                    headers: headers
                });

                this.fire('init', this.gets());
                //this.super(url, data, method, headers);
            },
            exec: function (url, data, method, headers){
                //var _argv = this.super(url, data, method, headers);

                var _argv = this.validateArgv(url, data, method, headers);
                var _result = Store.fire('before', _argv);
                if(_result===false){
                    return false;
                }
                _result = this.fire('before', _argv);
                if(_result===false){
                    return false;
                }

                //return _argv;

                if(_argv===false){
                    return false;
                }
                var _url = _argv.url,
                    _method = _argv.method,
                    _data = _argv.data,
                    _headers = _argv.headers,
                    _self = this,
                    _clone = {
                        method: _method.toUpperCase()
                    };

                switch (_method.toUpperCase()) {
                    case "POST":
                        var _temp = new FormData();
                        for(var key in _data){
                            _temp.append(key, _data[key]);
                        }
                        _clone.body = _temp;
                        _clone.headers = zn.overwrite(_headers, {
                            'Accept': 'multipart/form-data',
                            'Content-Type': 'multipart/form-data; charset=UTF-8'
                        });
                        break;
                    case "GET":
                        var _params = [];
                        zn.each(_data, function (value, key){
                            _params.push(key+'='+value);
                        });
                        _url += '?'+_params.join('&');
                        break;
                    case "JSON":
                        _clone.body = JSON.stringify(_data);
                        _clone.method = 'POST';
                        _clone.headers = zn.overwrite(_headers, {
                            'Accept': 'multipart/form-data',
                            'Content-Type': 'multipart/form-data; charset=UTF-8'
                        });
                        break;
                }

                return new Promise(function (resolve, reject) {
                    fetch(Store.fixURL(_url), _clone).then(function (response) {
                        return response.json();
                    }).then(function (responseData) {
                        _self.__onSuccess(responseData);
                        _self.__onComplete(responseData);
                        resolve(responseData);
                    }).catch(function (error) {
                        _self.__onError(error);
                        _self.__onComplete(error);
                        reject(error);
                    });
                });
            }
        }
    });

    var DataSource = zn.Class({
        events: [ 'init', 'before', 'after' ],
        properties: {
            data: null,
            argv: {
                set: function (value){
                    this._argv = value;
                },
                get: function (){
                    return this._argv || {};
                }
            }
        },
        methods: {
            init: function (data, argv) {
                this.reset(data, argv);
                this.fire('init', this);
            },
            reset: function (data, argv){
                if(data){
                    this._data = data;
                }
                if(argv){
                    this._argv = argv;
                }
                if(this._argv&&this._argv.autoLoad){
                    this.exec();
                }

                return this;
            },
            refresh: function (){
                return this.exec(), this;
            },
            exec: function (){
                var _data = this._data,
                    _self = this;
            	if(!_data){
                    return false;
                }

                if((this._argv.onExec && this._argv.onExec(_data))===false){
                    return false;
                }

                var _temp = this.fire('before', _data);
                if(_temp===false){
                    return false;
                }

            	if(_data.__id__){
                    _data.on('success', function (sender, data){
                        if(_self._argv.onSuccess){
                            _self._argv.onSuccess(data);
                        }
                    }).on('error', function (sender, data){
                        if(_self._argv.onError){
                            _self._argv.onError(data);
                        }
                    }).on('complete', function (sender, data){
                        if(_self._argv.onComplete){
                            _self._argv.onComplete(data);
                        }
                    }).exec();
            	} else {
                    return new Promise(function (resolve, reject) {
                        if(_data){
                            if(Store.fire('success', _data) === false){
                                return false;
                            }
                            if(_self._argv.onSuccess){
                                _self._argv.onSuccess(_data);
                            }
                            if(_self._argv.onComplete){
                                _self._argv.onComplete(_data);
                            }
                            resolve(_data);
                        }else {
                            if(Store.fire('error', _data) === false){
                                return false;
                            }
                            if(_self._argv.onError){
                                _self._argv.onError(_data);
                            }
                            if(_self._argv.onComplete){
                                _self._argv.onComplete(_data);
                            }
                            reject(_data);
                        }
                    });
            	}
            }
        }
    });

    var StoreClass = zn.Class({
        events: ['before', 'success', 'error', 'complete', 'after'],
        properties: {
            host: window.location.origin,
            engine: {
                set: function (value){
                    this._engine = value;
                },
                get: function (){
                    if(this._engine=='Fetcher'){
                        return Fetcher;
                    }else {
                        return XHR;
                    }
                }
            },
            headers: {}
        },
        methods: {
            request: function (url, data, method, headers){
                var _class = null;
                if(this._engine=='Fetcher'){
                    _class = Fetcher;
                }else {
                    _class = XHR;
                }

                return new _class(url, data, method, headers);
            },
            post: function (url, data, headers){
                return this.request(url, data, "POST", headers);
            },
            delete: function (url, data, headers){
                return this.request(url, data, "DELETE", headers);
            },
            put: function (url, data, headers){
                return this.request(url, data, "PUT", headers);
            },
            get: function (url, data, headers){
                var _argv = [];
                zn.each(data, function (value, key){
                    _argv.push(key + '=' + (zn.is(value, 'object')?JSON.stringify(value):value));
                });

                return this.request(url, _argv.join('&'), "GET", headers);
            },
            setHost: function (value){
                this._host = value;
            },
            getHost: function (){
                return this._host;
            },
            fixURL: function (url) {
                if(!url){
                    return '';
                }

                if(url && url.indexOf('http://') === -1){
                    url = this._host + url;
                }

                return url;
            },
            dataSource: function (data, argv) {
                return new DataSource(data, argv);
            }
        }
    });

    zn.store = zn.GLOBAL.Store = new StoreClass();

})(zn);
