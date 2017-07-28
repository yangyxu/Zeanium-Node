/**
 * Created by yangyxu on 2014/9/16.
 * Promise: Promise
 */
(function (zn){

    var __slice = Array.prototype.slice;

    //__slice.call(arguments);

    /**
     * Promise: Promise
     * @class Async
     * @namespace zn.util
     **/

    var PROMISE_STATE = {
        PENDING: 0,
        FULFILLED: 1,
        REJECTED: 2
    };

    var Defer = zn.Class({
        events: ['complete'],
        properties: {
            promise: null
        },
        methods: {
            init: function (resolve, reject) {
                this._promise = new Promise();
                if(resolve){
                    this.resolve(resolve);
                }
                if(reject){
                    this.reject(reject);
                }
            },
            resolve: function () {
                var data = __slice.call(arguments);
                try {
                    var _promise = this.get('promise'), _self = this;
                    if (_promise.get('readyState') != PROMISE_STATE.PENDING){
                        return;
                    }
                    _promise.set('readyState', PROMISE_STATE.FULFILLED);
                    _promise.set('data', data);
                    zn.each(_promise.get('resolves'), function (handler){
                        handler.apply(_self, data);
                    });
                } catch(ex) {
                    Async.catch(ex, this);
                }
                this.fire('complete', data);
            },
            reject: function () {
                var reason = __slice.call(arguments);
                try {
                    var _promise = this.get('promise');
                    if (_promise.get('readyState') != PROMISE_STATE.PENDING){
                        return;
                    }
                    _promise.set('readyState', PROMISE_STATE.REJECTED);
                    _promise.set('reason', reason);
                    var _handler = _promise.get('rejects')[0];
                    if (_handler){
                        _handler.apply(this, reason);
                    }
                } catch(ex) {
                    Async.catch(ex, this);
                }
                this.fire('complete', reason);
            }
        }
    });

    var Promise = zn.Class({
        statics: {
            isPromise: function (obj) {
                return obj !== null && obj !== undefined && typeof obj.then === 'function';
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
                function fulfill(){
                    var _data = __slice.call(arguments);
                    var _return = onFulfilled ? onFulfilled.apply(this, _data) : _data;

                    if (Promise.isPromise(_return)){
                        _return.then(function (){
                            deferred.resolve.apply(deferred, __slice.call(arguments));
                        });
                    } else {
                        deferred.resolve.apply(deferred, _return);
                    }

                    return _return;
                }

                if(this.get('readyState')===PROMISE_STATE.PENDING){
                    this.get('resolves').push(fulfill);
                    if(onRejected){
                        this.get('rejects').push(onRejected);
                    }else {
                        this.get('rejects').push(function () {
                            deferred.reject.apply(deferred, __slice.call(arguments));
                        });
                    }
                }else if (this.get('readyState')===PROMISE_STATE.FULFILLED) {
                    var _self = this;
                    setTimeout(function (){
                        //fulfill.call();
                        fulfill.apply(_self, _self.get('data'));
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

    var Async = zn.async = zn.Class({
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
                return this._exceptions.push(onException), this;
            },
            catch: function (ex, context){
                zn.each(this._exceptions, function (exception){
                    exception.call(context, ex);
                });

                return this;
            },
            finally: function (onFinally){
                return this._finallys.push(onFinally), this;
            },
            defer: function (resolve, reject) {
                var _self = this,
                    _defer = new Defer(resolve, reject);
                _defer.on('complete', function (sender, data){
                    _self._currIndex++;
                    _self._dataArray.push(data);
                    if(_self._currIndex==_self._count){
                        zn.each(_self._finallys, function (_finally){
                            try {
                                _finally(_self._dataArray);
                            } catch(e) {
                                zn.error(e.message);
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

})(zn);
