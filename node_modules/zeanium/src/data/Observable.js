/**
 * Created by yangyxu on 2015/7/23.
 * Observable
 */
(function (zn){
    /**
     * Observable
     * @class Observable
     * @namespace zn.data
     **/

    var Observable = zn.Class('zn.data.Observable', {
        properties: {

        },
        methods: {
            init: {
                auto: true,
                value: function () {
                    this.__watchers__ = {};
                }
            },
            dispose: function () {
                zn.each(this.__watchers__, function (watchers, name) {
                    this.__unbind(name, this.get(name));
                }, this);
                this.__watchers__ = null;
            },
            watch: function (path, handler, context){
                var _paths = path === '*' ?
                    this.constructor._properties_ :
                    (zn.is(path, 'array') ? path : [ path ]);

                _paths.forEach(function (_path){
                    this.__watch(_path, handler, context);
                }, this);

                return this;
            },
            unwatch: function (path, handler, context){
                var _paths = path === '*' ?
                    this.constructor._properties_ :
                    (zn.is(path, 'array') ? path : [ path ]);

                _paths.forEach(function (_path){
                    this.__unwatch(_path, handler, context);
                }, this);

                return this;
            },
            notify: function (name){
                var _names = name === '*' ? Object.keys(this.__watchers__) : (zn.is(name, 'array') ? name : [ name ]);

                zn.each(_names, function (_name){
                    this.__notify(_name);
                }, this);

                return this;
            },
            __watch: function (path, handler, context){
                var _index = path.indexOf('.'),
                    _name = path,
                    _subPath = '',
                    __watchers__ = this.__watchers__;

                if (_index >= 0) {
                    _name = path.slice(0, _index);
                    _subPath = path.slice(_index + 1);
                    var _sub = this.get(_name);
                    if (_sub && _sub.watch) {
                        _sub.watch(_subPath, handler, context);
                    }
                }

                var _watchers = __watchers__[_name] = __watchers__[_name] || [];

                _watchers.push({
                    handler: handler,
                    context: context,
                    fullPath: path,
                    subPath: _subPath
                });

                var _prop = this.member(_name);
                if (_prop && _prop.type === 'property') {
                    var _meta = _prop.meta;
                    if (!_meta.watched) {
                        var _getter = _prop.getter,
                            _setter = _prop.setter;

                        Observable.defineProperty(_name, {
                            get: function (options) {
                                return _getter.call(this, options);
                            },
                            set: function (value, options) {
                                var _oldValue = _getter.call(this);
                                if (_oldValue !== value || (options && options.force)) {
                                    this.__unbind(_name, _oldValue);
                                    if (_setter.call(this, value, options) !== false) {
                                        this.__bind(_name, value);
                                        this.notify(_name);
                                    }
                                }
                            },
                            watched: true
                        }, this);
                    }
                }
            },
            __unwatch: function (path, handler, context){
                var _index = path.indexOf('.'),
                    _name = path,
                    _subPath = '',
                    __watchers__ = this.__watchers__;

                if (_index >= 0) {
                    _name = path.slice(0, _index);
                    _subPath = path.slice(_index + 1);
                    var _sub = this.get(_name);
                    if (_sub && _sub.unwatch) {
                        _sub.unwatch(_subPath, handler, context);
                    }
                }

                var _watchers = __watchers__[_name],
                    _watcher;

                if (!_watchers){
                    return false;
                }

                if (handler) {
                    for (var i = 0, _len = _watchers.length; i < _len; i++) {
                        _watcher = _watchers[i];
                        if (_watcher.handler === handler && _watcher.context === context) {
                            _watchers.splice(i, 1);
                            break;
                        }
                    }
                }
                else {
                    _watchers.length = 0;
                }
            },
            __bind: function (name, value){
                if (value && value.watch) {
                    zn.each(this.__watchers__[name], function (watcher) {
                        if (watcher.subPath) {
                            value.watch(watcher.subPath, watcher.handler, watcher.context);
                        }
                    });
                }
            },
            __unbind: function (name, value){
                if (value && value.unwatch) {
                    zn.each(this.__watchers__[name], function (watcher) {
                        if (watcher.subPath) {
                            value.unwatch(watcher.subPath, watcher.handler, watcher.context);
                        }
                    });
                }
            },
            __notify: function (name){
                var _value = this.get(name);
                zn.each(this.__watchers__[name], function (watcher) {
                    if (watcher && watcher.handler) {
                        watcher.handler.call(watcher.context, zn.path(_value, watcher.subPath), watcher.fullPath, this);
                    }
                }, this);
            }
        }
    });

})(zn);
