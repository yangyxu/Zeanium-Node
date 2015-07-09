/**
 * Created by yangyxu on 2014/9/16.
 */
zn.module(function () {

    /**
     * Promise: Promise
     * @class nx.async
     * @namespace nx.async
     **/

    var PROMISE_STATE = {
        PENDING: 0,
        FULFILLED: 1,
        REJECTED: 2
    };

    var Async = zn.class('Async', {
        static: true,
        methods: {
            init: function (inArgs) {
                this._exceptions = [];
                this._finallys = [];
                this._count = 0;
                this._currIndex = 0;
                this._dataArray = [];
            },
            exception: function (onException){
                this._exceptions.push(onException);
                return this;
            },
            catch: function (ex, context){
                zn.each(this._exceptions, function (exception){
                    exception.call(context, ex);
                });
                return this;
            },
            finally: function (onFinally){
                this._finallys.push(onFinally);
                return this;
            },
            defer: function (inArgs) {
                var _self = this, _defer = new Defer(inArgs);
                _defer.on('complete', function (sender, data){
                    _self._currIndex++;
                    _self._dataArray.push(data);
                    if(_self._currIndex==_self._count){
                        zn.each(_self._finallys, function (_finally){
                            try{
                                _finally(_self._dataArray);
                            }catch(e){
                                console.log(e.message);
                            }
                        });
                        _self._finallys = [];
                    }
                });
                _self._count++;
                return _defer;
            },
            all: function (promises) {
                var _deferred = Async.defer();
                var _n = 0, _result = [];
                zn.each(promises, function (promise){
                    promise.then(function (ret){
                        _result.push(ret);
                        _n++;
                        if(_n>=promises.length){
                            _deferred.resolve(_result);
                        }
                    });
                });
                return _deferred.promise;
            },
            any: function (promises) {
                var _deferred = Async.defer();
                zn.each(promises, function (promise){
                    promise.then(function (ret){
                        _deferred.resolve(ret);
                    });
                });
                return _deferred.promise;
            }
        }
    });


    var Defer = zn.class('Defer', {
        events: ['complete'],
        properties: {
            promise: null
        },
        methods: {
            init: function (inArgs) {
                this._promise = new Promise();
            },
            resolve: function (data) {
                try{
                    var _promise = this.get('promise');
                    if (_promise.get('readyState') != PROMISE_STATE.PENDING){
                        return;
                    }
                    _promise.set('readyState', PROMISE_STATE.FULFILLED);
                    _promise.set('data', data);
                    zn.each(_promise.get('resolves'), function (handler){
                        handler(data);
                    });
                }catch(ex){
                    Async.catch(ex, this);
                }
                this.fire('complete', data);
            },
            reject: function (reason) {
                try{
                    var _promise = this.get('promise');
                    if (_promise.get('readyState') != PROMISE_STATE.PENDING){
                        return;
                    }
                    _promise.set('readyState', PROMISE_STATE.REJECTED);
                    _promise.set('reason', reason);
                    var _handler = _promise.get('rejects')[0];
                    if (_handler){
                        _handler(reason);
                    }
                }catch(ex){
                    Async.catch(ex, this);
                }
                this.fire('complete', reason);
            }
        }
    });

    var Promise = zn.class('Promise', {
        statics: {
            isPromise: function (obj) {
                return obj!=null&&typeof obj['then'] =='function';
            },
            defer: null
        },
        properties: {
            resolves: null,
            rejects: null,
            data: null,
            reason: null,
            readyState: null
        },
        methods: {
            init: function (inArgs) {
                this.set('resolves', []);
                this.set('rejects', []);
                this.set('exceptions', []);
                this.set('readyState',PROMISE_STATE.PENDING);
            },
            then: function (onFulfilled, onRejected) {
                var deferred = new Defer();
                function fulfill(data){
                    var _return = onFulfilled?onFulfilled(data):data;
                    if(Promise.isPromise(_return)){
                        _return.then(function (data){
                            deferred.resolve(data);
                        });
                    }else {
                        deferred.resolve(_return);
                    }
                    return _return;
                }

                if(this.get('readyState')===PROMISE_STATE.PENDING){
                    this.get('resolves').push(fulfill);
                    if(onRejected){
                        this.get('rejects').push(onRejected);
                    }else {
                        this.get('rejects').push(function (reason) {
                            deferred.reject(reason);
                        });
                    }
                }else if (this.get('readyState')===PROMISE_STATE.FULFILLED) {
                    var _self = this;
                    setTimeout(function (){
                        fulfill(_self.get('data'));
                    });
                }

                return deferred.promise;

            },
            catch: function (onException){
                return Async.exception(onException);
            },
            finally: function (onFinally){
                return Async.finally(onFinally);
            },
            otherwise: function (onRejected) {
                return this.then(undefined, onRejected);
            }
        }
    });

    return Async;
});