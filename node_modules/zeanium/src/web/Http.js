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
