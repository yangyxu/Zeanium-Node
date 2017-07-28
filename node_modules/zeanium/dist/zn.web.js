(function (zn) {

    var MIME = {
        text: 'text/plain; charset=UTF-8',
        html: 'text/html; charset=UTF-8',
        xml: 'text/xml; charset=UTF-8',
        form: 'application/x-www-form-urlencoded; charset=UTF-8',
        json: 'application/json; charset=UTF-8',
        javascript: 'text/javascript; charset=UTF-8'
    };

    var Task = zn.Class({
        events: [
            'init',
            'start',
            'stop',
            'cancle',
            'goNext',
            'goPre'
        ],
        properties: {
            pre: null,
            next: null,
            delay: null,
            action: null,
            args: [],
            context: this,
            taskList: null,
            status: {
                value: '',
                get: function () { return this._status; }
            }
        },
        methods: {
            init: function (config) {
                this.sets(config);
                this.fire('init', this);
            },
            start: function (){
                if (this._status=='started'){ return; }
                if (this._action){
                    this._action.apply(this._context, this._args);
                    this._status = 'started';
                }else {
                    this.goNext();
                }
                this.fire('start', this);
            },
            stop: function (){
                this._status = 'stoped';
                this.fire('stop', this);
            },
            cancle: function (){
                this._status = 'cancle';
                this.fire('cancle', this);
            },
            goNext: function (){
                if (this._next){
                    this._next.start();
                }
                this.fire('goNext', this);
            },
            goPre: function (){
                if (this._pre){
                    this._pre.start();
                }
                this.fire('goPre', this);
            }
        }
    });

    /**
     * XHR: XmlHttpRequest
     * @class XHR
     * @constructor
     */
    var XHR = zn.Class({
        properties: {
            url: '',
            data: {
                set: function (value){
                    this._data = value;
                },
                get: function (){
                    return zn.is(this._data, 'object') ? JSON.stringify(this._data) : this._data;
                }
            },
            method: 'GET',
            asyns: true,
            username: null,
            password: null,
            headers: {
                get: function(){
                    return zn.overwrite({
                        'X-Requested-With': 'XMLHttpRequest',
                        'Content-type': 'application/json'
                    }, this._headers);
                },
                set: function (value){
                    this._headers = value;
                }
            },
            timeout: {
                get: function (){
                    return this._timeout || 2e4;
                },
                set: function (value){
                    this._timeout = value;
                }
            }
        },
        events: [
            'before',
            'after',
            'success',
            'error',
            'complete',
            'timeout'
        ],
        methods: {
            init: function (argv){
                this.sets(argv);
                this._isRunning = false;
            },
            __initXMLHttpRequest: function (){
                if (this._XMLHttpRequest){
                    return this._XMLHttpRequest;
                }
                if (!window.ActiveXObject){
                    return this._XMLHttpRequest = new XMLHttpRequest(), this._XMLHttpRequest;
                }
                var e = "MSXML2.XMLHTTP",
                    t = ["Microsoft.XMLHTTP", e, e + ".3.0", e + ".4.0", e + ".5.0", e + ".6.0"];

                for (var i = t.length - 1; i > -1; i--) {
                    try {
                        return this._XMLHttpRequest = new ActiveXObject(t[i]), this._XMLHttpRequest;
                    } catch (ex) {
                        continue;
                    }
                }
            },
            __onComplete: function(XHR, data){
                clearTimeout(this._timeoutID);
                XHR.abort();
                this._isRunning = false;
                this.fire('complete', XHR, data);
                this.fire('after', XHR, data);
                this.offs();
            },
            __initRequestHeader: function (RH, args){
                for(var k in args){
                    RH.setRequestHeader(k, args[k]);
                }
            },
            resetEvents: function(){
                this.offs();
            },
            send: function (config){
                if (this._isRunning){
                    return false;
                }
                this.sets(config);
                var _XHR = this.__initXMLHttpRequest(),
                    _self = this,
                    _defer = zn.async.defer();

                this._isRunning = true;
                if(this.timeout){
                    this._timeoutID = setTimeout(function(){
                        if(_self._isRunning){
                            _self.fire('timeout', _self);
                            _self.__onComplete(_XHR, 'timeout');
                        }
                    }, this.timeout);
                }

                if(this.fire('before', this)===false || !this.url){
                    return this.__onComplete(_XHR), _defer.promise;
                }

                var _url = this.url,
                    _data = this.data,
                    _method = this._method.toUpperCase();
                if(_method === 'GET'){
                    if(_data){
                        _url = _url + '?' + _data;
                    }
                    _data = null;
                }
                if(_XHR.readyState<2){
                    //_XHR.withCredentials = true;
                }

                _XHR.open(_method, _url, this.asyns);
                _XHR.onreadystatechange = function (event){
                    var _XHR = event.currentTarget;
                    if (_XHR.readyState == 4) {
                        var e = _XHR.status,
                            t = _XHR.responseText,
                            _ct = _XHR.getResponseHeader('Content-Type');

                        if (e >= 200 && e < 300) {
                            try {
                                t = (_ct && _ct.indexOf('application/json')>=0) ? JSON.parse(t) : t;
                            } catch (error) {
                                t = t;
                            }
                            this.fire('success', t);
                            _defer.resolve(t, _XHR);
                        } else {
                            this.fire('error', _XHR);
                            _defer.reject(_XHR, t);
                        }

                        return this.__onComplete(_XHR, t), t;
                    }
                }.bind(this);
                this.__initRequestHeader(_XHR, this.headers);
                _XHR.send(_data);
                if(!this.asyns){
                    this.__onComplete(_XHR);
                }

                return _defer.promise;
            },
            abort: function (){
                if(this._XMLHttpRequest){
                    this._XMLHttpRequest.abort();
                }
            }
        }
    });

    /**
     * XHRPool: XmlHttpRequestPool
     * @class nx.http.XHRPool
     * @constructor
     */
    var XHRPool = zn.Class({
        static: true,
        properties: {
            max: 3,
            count: {
                get: function (){ return this._data.length;  }
            }
        },
        methods: {
            init: function (){
                this._data = [];
            },
            getInstance: function (){
                for(var i= 0, _len = this._data.length; i<_len; i++){
                    if(!this._data[i]._isRunning){
                        return this._data[i].resetEvents(), this._data[i];
                    }
                }

                return (function(context){
                    var _xhr = new XHR();
                    context._data.push(_xhr);
                    return _xhr;
                })(this);
            }
        }
    });

    zn.http = zn.Class({
        static: true,
        properties: {
            timeout: 1000
        },
        methods: {
            request: function (value, callback){
                var _xhr = XHRPool.getInstance();
                zn.each(value, function(v, k){
                    if(typeof v=='function'){
                        _xhr.on(k, v, this);
                    }
                }, this);

                if(callback) {
                    callback(_xhr);
                }

                return _xhr.send(value);
            },
            get: function (value){
                return value.method = 'GET', this.request(value);
            },
            post: function (value){
                return value.method = 'POST', this.request(value);
            },
            put: function (value){
                return value.method = 'PUT', this.request(value);
            },
            delete: function (value){
                return value.method = 'DELETE', this.request(value);
            }
        }
    });

})(zn);

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

(function (zn) {

    zn.cookie = zn.Class({
        static: true,
        methods: {
            setItem: function (name, value, time) {
                var _name = name + '=' + encodeURIComponent(value);
                if (time) {
                    _name += '; expires=' + (new Date(+(new Date()) + time * 36E5)).toGMTString();
                }

                document.cookie = _name;
            },
            getItem: function (name) {
                var oRE = new RegExp('(?:; )?' + name + '=([^;]*);?');
                if (oRE.test(document.cookie)) {
                    return decodeURIComponent(RegExp.$1);
                } else {
                    return null;
                }
            },
            removeItem: function (name) {
                this.setItem(name, null, -9999);
            },
            clear: function () {
                document.cookie = null;
            }
        }
    });

})(zn);

(function (zn) {
    var tempElement = document.createElement('div'),
        tempStyle = tempElement.style;
    var rsizeElement = /width|height|top|right|bottom|left|size|margin|padding/i,
        rHasUnit = /[c-x%]/,
        PX = 'px',
        rUpperCameCase = /(?:^|-)([a-z])/g,
        rDeCameCase = /([A-Z])/g;

    var cssNumber = {
        'lineHeight': true,
        'zIndex': true,
        'zoom': true
    };

    var styleHooks = {
        float: 'cssFloat'
    };

    zn.style = zn.Class({
        static: true,
        methods: {
            each: function (target, callback, context) {
                if (target && callback) {
                    var length = target.length;
                    if (length >= 0) {
                        for (var i = 0; i < length; i++) {
                            callback.call(context, target[i], i);
                        }
                    }
                    else {
                        for (var key in target) {
                            if (target.hasOwnProperty(key)) {
                                callback.call(context, target[key], key);
                            }
                        }
                    }
                }
            },
            getCssText: function (inStyles) {
                var cssText = [''];
                this.each(inStyles,function (styleValue,styleName) {
                    cssText.push(this.getStyleProperty(styleName,true) + ':' + this.getStyleValue(styleName,styleValue));
                },this);
                return cssText.join(';');
            },
            getStyleValue: function (inName,inValue) {
                var property = this.getStyleProperty(inName);
                var value = inValue;
                if (rsizeElement.test(property)) {
                    if (!rHasUnit.test(inValue) && !cssNumber[property]) {
                        value += PX;
                    }
                }
                return value;
            },
            getStyleProperty: function (inName,isLowerCase) {
                var property = this.lowerCamelCase(inName);
                if (property in tempStyle) {
                    if (isLowerCase) {
                        property = this.deCamelCase(inName);
                    }
                } else {
                    if (isLowerCase) {
                        property = env.prefix()[1] + inName;
                    } else {
                        property = env.prefix()[0] + this.upperCamelCase(inName);
                    }
                }
                return styleHooks[inName] || property;
            },
            lowerCamelCase: function (inName) {
                var _camelizeString = this.upperCamelCase(inName);
                return _camelizeString.charAt(0).toLowerCase() + _camelizeString.substring(1);
            },
            upperCamelCase: function (inName) {
                return inName.replace(rUpperCameCase,function (match,group1) {
                    return group1.toUpperCase();
                });
            },
            deCamelCase: function (inName) {
                return inName.replace(rDeCameCase,function (match,group1) {
                    return '-' + group1.toLowerCase();
                });
            },
            capitalize: function (inString) {
                return inString.charAt(0).toUpperCase() + inString.slice(1);
            }
        }
    });

    zn.dom = zn.Class({
        static: true,
        methods: {
            hasClass: function (target, className) {
                return target.classList.contains(className);
            },
            addClass: function (target) {
                var classList = target.classList;
                arguments.shift();
                return classList.add.apply(classList, arguments);
            },
            removeClass: function (target) {
                var classList = target.classList;
                arguments.shift();
                return classList.remove.apply(classList, arguments);
            },
            toggleClass: function (target, inClassName) {
                return  target.classList.toggle(inClassName);
            },
            setStyle: function (target, inName, inValue) {
                var property = zn.style.getStyleProperty(inName);
                target.style[property] = zn.style.getStyleValue(inName,inValue);
            },
            getStyle: function (target, inName, isInline) {
                var element = target,
                    property = zn.style.getStyleProperty(inName),
                    styles = isInline ? target.style : (window.getComputedStyle?getComputedStyle(element, null):element.currentStyle);

                return styles[property] || '';
            },
            removeStyle: function (target, inName) {
                var property = zn.style.getStyleProperty(inName,true);
                target.style.removeProperty(property);
            },
            hasStyle: function (target, inName) {
                //todo:height/line-height
                //fix bug
                var cssText = target.style.cssText;
                return cssText.indexOf(inName + ':') > -1;
            },
            setStyles: function (target, inStyles) {
                target.style.cssText += zn.style.getCssText(inStyles);
            },
            getPosition: function (target){
                var _target = target,
                    _x = 0, _y = 0, _w = 0, _h = 0;

                if(_target.getBoundingClientRect){
                    var _bounding = _target.getBoundingClientRect();
                    _x = _bounding.left + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft) - document.documentElement.clientLeft;
                    _y = _bounding.top + Math.max(document.documentElement.scrollTop, document.body.scrollTop) - document.documentElement.clientTop;
                    _w = _bounding.width;
                    _h = _bounding.height;
                } else {
                    while (_target != document.body) {
                        if(!_target){ break; }
                        _x += _target.offsetLeft;
                        _y += _target.offsetTop;
                        _target = _target.offsetParent;
                    }
                    _w = _target.offsetWidth;
                    _h = _target.offsetHeight;
                }

                /*
                while (_target != document.body) {
                    if(!_target){ break; }
                    _x += _target.offsetLeft + _target.scrollLeft || 0;
                    _y += _target.offsetTop + _target.scrollTop || 0;
                    _target = _target.offsetParent;
                }
                _w = target.offsetWidth;
                _h = target.offsetHeight;*/

                return {
                    x: _x,
                    y: _y,
                    width: _w,
                    height: _h
                };
            },
            on: function(target, event, handler){
                if (target.addEventListener) {
                    target.addEventListener(event, handler, false);
                } else if (element.attachEvent) {
                    target.attachEvent('on' + event, handler);
                } else {
                    target['on' + event] = handler;
                }
            },
            off:function(target, event, handler){
                if (target.removeEventListener) {
                    target.removeEventListener(event, handler, false);
                } else if (target.detachEvent) {
                    target.detachEvent('on' + event, handler);
                } else {
                    target['on' + event] = null;
                }
            }
        }
    });

})(zn);
