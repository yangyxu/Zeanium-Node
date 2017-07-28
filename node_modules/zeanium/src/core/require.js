/**
 * require module
 */
(function (zn){

    var DOT = '.',
        DOUBLE_DOT = '..',
        SLASH = '/',
        MODULE_STATUS = {
            PENDING: 0,
            LOADING: 1,
            WAITING: 2,
            LOADED: 3
        };


    var _doc = null;

    if(typeof module !== 'undefined' && module.exports){
        zn.SLASH = SLASH = require('path').sep;
    }else {
        _doc = document;
    }

    var __path = {
        normalizePath: function (path){
            var _paths = path.split(SLASH);
            var _values = [_paths[0]],
                _path;

            for (var i = 1, _len = _paths.length; i < _len; i++) {
                _path = _paths[i];
                switch(_path){
                    case DOT:
                        //ignore
                        break;
                    case DOUBLE_DOT:
                        var _last = _values[_values.length - 1];
                        if (_last === DOT || _last === DOUBLE_DOT) {
                            _values.push(DOUBLE_DOT);
                        }
                        else {
                            _values.pop();
                        }
                        break;
                    default:
                        _values.push(_path);
                        break;
                }
            }

            return _values.join(SLASH);
        },
        formatPath: function (path, parent){
            var _path = path;
            if(SLASH === '/') {
                _path = _path.split('\\').join(SLASH);
            }else {
                _path = _path.split('/').join(SLASH);
            }

            var _parentPath = parent ? (parent.get('path')||zn.PATH): zn.PATH,
                _slashIndex = _path.indexOf(SLASH);

            if(_path.indexOf(zn.PATH) > -1 || _path.indexOf(zn.ZN_PATH) > -1){
                return _path;
            }

            if (_slashIndex > 0) {
                _path = _parentPath ? (_parentPath.substring(0, _parentPath.lastIndexOf(SLASH) + 1) + _path) : _path;
            }
            else if (_slashIndex === 0) {
                _path = zn.PATH.substring(0, zn.PATH.lastIndexOf(SLASH)) + _path;
            }
            else {
                _path = zn.ZN_PATH + SLASH + _path + SLASH;
            }

            if(_path.slice(-1) === SLASH){
                _path += 'index.js';
            }

            _path = this.normalizePath(_path);

            return _path;
        }
    };

    var Module = zn.Class('zn.Module', {
        events: [
            'pending',
            'loading',
            'waiting',
            'loaded'
        ],
        statics: {
            all: {},
            current: null,
            counter: 0,
            preLoadedPackage: {},
            unloadModule: function (path){
                try {
                    if(!Module.all[path]){
                        return this;
                    }
                    path = require.resolve(path);

                    var module = require.cache[path];
                    // remove reference in module.parent
                    if (module && module.parent) {
                        module.parent.children.splice(module.parent.children.indexOf(module), 1);
                    }
                    require.cache[path] = null;
                    var _module = Module.all[path];

                    Module.all[path] = null;
                    if(_module&&_module.parent){
                        Module.unloadModule(_module.parent.path);
                    }
                } catch (e) {
                    zn.error('Module unloadModule error: ', e.message);
                    console.log(e);
                }

                return this;
            },
            loadModule: function (path, callback, parent){
                if(SLASH === '/') {
                    path = path.split('\\').join(SLASH);
                }else {
                    path = path.split('/').join(SLASH);
                }

                if (zn.is(path, Module)){
                    return path.load(callback);
                }
                if (path.substring(0, 5) === 'node:') {
                    return callback(require(path.substring(5)));
                }

                var _path = null;
                if(zn.NODE_PATHS && zn.NODE_PATHS.length){
                    zn.NODE_PATHS.every(function (nodepath, index){
                        if(path.indexOf(nodepath) === 0){
                            return _path = path, false;
                        }else {
                            return true;
                        }
                    });
                }

                if(!_path){
                    _path = __path.formatPath(path, parent);
                    if(!_doc) {
                        try {
                            _path = require.resolve(_path, parent);
                        } catch (e) {
                            zn.error('node require.resolve(' + _path + '): ', e.message);
                            console.log(e);
                            return callback({});
                        }
                    }
                }

                var _module = Module.all[_path];
                if (_module) {
                    _module.load(callback);
                }
                else {
                    _module = Module.all[_path] = new Module(_path);
                    Module.counter++;
                    if (_doc) {
                        this.__webModule(_path, function (err){
                            Module.counter--;

                            if (err) {
                                throw new Error('Failed to load module:' + path);
                            }
                            else {
                                _module.sets({
                                    parent: parent,
                                    path: _path,
                                    dependencies: Module.current.get('dependencies'),
                                    factory: Module.current.get('factory'),
                                    status: MODULE_STATUS.LOADING
                                });
                                _module.load(callback);
                            }
                        });
                    }
                    else {
                        this.__nodeModule(_path, function (mod){
                            Module.counter--;

                            _module.sets({
                                parent: parent,
                                path: _path,
                                dependencies: Module.current.get('dependencies'),
                                factory: Module.current.get('factory'),
                                status: MODULE_STATUS.LOADING
                            });
                            _module.load(callback);
                        });
                    }
                }
            },
            __nodeModule: function (path, callback){
                var _path = path,
                    _callback = callback || zn.idle,
                    _value = {};
                try {
                    _value = require(_path);
                } catch (e) {
                    zn.error('Node.js require('+_path+') error: ', e.message);
                    console.error(e);
                } finally {
                    _callback(_value);
                }
            },
            __webModule: function (path, callback){
                var _head = _doc.head || _doc.getElementsByTagName('head')[0],
                    _script = _doc.createElement('script'),
                    _path = path,
                    _callback = callback || zn.idle;

                var _handler = function (err) {
                    _script.onload = null;
                    _script.onerror = null;
                    _callback(err);
                };

                _path = _path.slice(-1) === SLASH ? _path + 'index.js' : _path;
                _path = _path.slice(-3).toLowerCase() === '.js' ? _path : _path + '.js';
                _script.src = _path;
                //_script.async = false;

                if ('onload' in _script) {
                    _script.onload = function () {
                        _handler(null);
                    };
                }
                else {
                    _script.onreadystatechange = function (e) {
                        var _state = _script.readyState;
                        if (_state === 'loaded' || _state === 'complete') {
                            _handler(null);
                        }
                        else {
                            _handler(e);
                        }
                    };
                }

                _script.onerror = function (e) {
                    _handler(e);
                };

                _head.appendChild(_script);
            }
        },
        properties: {
            parent: null,
            status: MODULE_STATUS.PENDING,
            path: '',
            dependencies: null,
            factory: null,
            value: {
                set: function (value){
                    if(value._ctors_){
                        value.$path = this.get('path');
                    }
                    this._value = value;
                },
                get: function (){
                    return this._value;
                }
            }
        },
        methods: {
            init: function (path, dependencies, factory) {
                this.sets({
                    path: path,
                    dependencies: dependencies || [],
                    factory: factory,
                    value: {}
                });

                this._callbacks = [];
            },
            exec: function (callback){
                var _argv = process.argv,
                    _path = _argv[1];

                this.sets({
                    path: _path,
                    status: MODULE_STATUS.LOADING
                });

                return this.load(callback), this;
            },
            __pending: function (callback){
                this._callbacks.push(callback);
            },
            __loading: function (callback){
                var _path = this.get('path'),
                    _deps = this.get('dependencies'),
                    _depHandler = this._depHandler,
                    _factory = this.get('factory'),
                    _value = this.get('value');


                this.set('status', MODULE_STATUS.WAITING);
                this._callbacks.push(callback);

                var _depLength = _deps.length;
                if (_depLength === 0) {
                    _value = _factory.call(_value) || _value;
                    this.set('value', _value);
                    this.set('status', MODULE_STATUS.LOADED);

                    zn.each(this._callbacks, function (cb) {
                        cb(_value);
                    });
                }
                else {
                    var _params = [],
                        _self = this;
                    zn.each(_deps, function (_dep, _index){
                        if(_depHandler){
                            _dep = _depHandler(_dep, _index);
                        }
                        Module.loadModule(_dep, function (_param){
                            _params[_index] = _param;
                            _depLength--;
                            if(_depLength === 0){
                                _value = _factory.apply(_value, _params) || _value;
                                _self.set('value', _value);
                                _self.set('status', MODULE_STATUS.LOADED);

                                zn.each(_self._callbacks, function (cb) {
                                    cb(_value);
                                });
                            }
                        }, _self);

                    });

                }
            },
            __waiting: function (callback){
                var _self = this;
                setTimeout(function () {
                    if (Module.counter === 0) {
                        _self.set('status', MODULE_STATUS.LOADING);
                    }
                    _self.load(callback);
                });
            },
            __loaded: function (callback){
                callback(this.get('value'));
            },
            load: function (callback) {
                var _status = this.get('status'),
                    _callback = callback || zn.idle;

                switch(_status){
                    case MODULE_STATUS.PENDING:
                        this.__pending(_callback);
                        break;
                    case MODULE_STATUS.LOADING:
                        this.__loading(_callback);
                        break;
                    case MODULE_STATUS.WAITING:
                        this.__waiting(_callback);
                        break;
                    case MODULE_STATUS.LOADED:
                        this.__loaded(_callback);
                        break;
                }

                return this;
            }
        }
    });

    /**
     * Define a module
     * @param deps
     * @param callback
     * @returns {object}
     */
    zn.define = function () {
        var _args = arguments,
            _len = _args.length,
            _arg0 = _args[0],
            _deps = [],
            _factory = null;

        switch (_len) {
            case 1:
                if (zn.is(_arg0, 'function')) {
                    _factory = _arg0;
                } else if (zn.is(_arg0, 'array')) {
                    _deps = _arg0;
                    _factory = function () {
                        var _values = {};
                        zn.each(arguments, function (_module) {
                            if (_module._name_) {
                                _values[_module._name_] = _module;
                            }
                            else {
                                zn.extend(_values, _module);
                            }
                        });

                        return _values;
                    };
                } else {
                    _factory = function () {
                        return _arg0;
                    };
                }
                break;
            case 2:
                _deps = _arg0;
                _factory = _args[1];
                break;
            case 3:
                _deps = _arg0;
                _factory = _args[1];
                break;
        }

        if(_deps && zn.is(_deps, 'string')){
            _deps = [_deps];
        }

        Module.current = new Module('', _deps, _factory);

        if(_args[2]){
            Module.current._depHandler = _args[2];
        }

        return Module.current;
    };

    var Loader = zn.Class('zn.Loader', {
        static: true,
        properties: {
            preLoadPackages: []
        },
        methods: {
            init: function () {
                var _packages = this.preLoadPackages;
                for(var i= 0, _len = _packages.length; i<_len; i++){
                    this.loadPackage(_packages[i]);
                }
            },
            loadPackage: function (_package){
                this.load(_package+'index.js', function (value){
                    zn.extend(Module.preLoadedPackage, value);
                });
            },
            load: function (path, callback, parent) {
                return Module.loadModule(path, callback, parent), this;
            }
        }
    });

    zn.load = Loader.load;
    zn.module = Module;

})(zn);
