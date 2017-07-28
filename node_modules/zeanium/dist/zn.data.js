(function (zn) {

    var ArrayPrototype = Array.prototype,
        __push = ArrayPrototype.push,
        __sort = ArrayPrototype.sort,
        __join = ArrayPrototype.join,
        __slice = ArrayPrototype.slice,
        __splice = ArrayPrototype.splice,
        __indexOf = ArrayPrototype.indexOf,
        __lastIndexOf = ArrayPrototype.lastIndexOf,
        __forEach = ArrayPrototype.forEach,
        __toArray = function (data) {
            if (zn.is(data, List)) {
                return data.toArray();
            }
            else if (zn.is(data, 'array')) {
                return data.slice(0);
            }
            else {
                var _data = [];
                zn.each(data, function (item) {
                    _data.push(item);
                });

                return _data;
            }
        };

    var List = zn.Class('zn.data.List', {
        properties: {
            /**
             * @property count
             * @type {Number}
             */
            count: {
                get: function () {
                    return this.length;
                },
                set: function (){
                    throw new Error("Unable to set count of List");
                }
            }
        },
        methods: {
            init: {
                auto:true,
                value: function (data) {
                    this.length = 0;
                    this.insertRange(data, 0);
                }
            },
            unique: function (){

            },
            dispose: function () {
                this.clear();
            },
            /**
             * Add an item.
             * @method add
             * @param item
             */
            add: function (item) {
                var _index = this.length;
                __push.call(this, item);

                return _index;
            },
            /**
             * Add multiple items.
             * @method addRange
             * @param iter
             * @returns {*}
             */
            addRange: function (data) {
                return this.insertRange(data, this.length);
            },
            /**
             * @method remove
             * @param item
             * @returns {*}
             */
            remove: function (item) {
                var _index = this.indexOf(item);
                if (_index >= 0) {
                    __splice.call(this, _index, 1);
                    return _index;
                }
                else {
                    return -1;
                }
            },
            /**
             * @method removeAt
             * @param index
             * @returns {*}
             */
            removeAt: function (index) {
                return __splice.call(this, index, 1)[0];
            },
            /**
             * @method insert
             * @param item
             * @param index
             */
            insert: function (item, index) {
                return __splice.call(this, index, 0, item), item;
            },
            /**
             * @method insertRange
             * @param index
             * @param iter
             * @returns {*}
             */
            insertRange: function (data, index) {
                return __splice.apply(this, [index, 0].concat(__toArray(data))), index;
            },
            /**
             * @method clear
             * @returns {*}
             */
            clear: function () {
                return __splice.call(this, 0);
            },
            /**
             * @method getItem
             * @param index
             * @returns {*}
             */
            getItem: function (index) {
                if (index < this.length) {
                    return this[index];
                }
                else {
                    throw new Error('Index out of range.');
                }
            },
            /**
             * @method setItem
             * @param index
             * @param item
             * @returns {*}
             */
            setItem: function (index, item) {
                if (index < this.length) {
                    this[index] = item;
                }
                else {
                    throw new Error('Index out of range.');
                }
            },
            /**
             * @method getRange
             * @param index
             * @param count
             * @returns {*}
             */
            getRange: function (index, count) {
                return new List(__slice.call(this, index, index + count));
            },
            /**
             * @method indexOf
             * @param item
             * @returns {*}
             */
            indexOf: function (item) {
                return __indexOf.call(this, item);
            },
            /**
             * @method lastIndexOf
             * @param item
             * @returns {*}
             */
            lastIndexOf: function (item) {
                return __lastIndexOf.call(this, item);
            },
            /**
             * @method contains
             * @param item
             * @returns {boolean}
             */
            contains: function (item) {
                return this.indexOf(item) >= 0;
            },
            toggle: function (item){
                if(this.contains(item)){
                    this.remove(item);
                }else{
                    this.add(item);
                }
            },
            /**
             * @method sort
             * @param callback
             * @returns {Array}
             */
            sort: function (callback) {
                return __sort.call(this, callback);
            },
            /**
             * @method each
             * @param callback
             * @param context
             */
            each: function (callback, context) {
                __forEach.call(this, callback, context);
            },
            /**
             * @method  toArray
             * @returns {Array}
             */
            toArray: function () {
                return __slice.call(this, 0);
            },
            join: function (){
                return __join.call(this);
            }
        }
    });

})(zn);

/**
 * Created by yangyxu on 2014/9/16.
 * TList
 */
(function (zn){

    /**
     * TList
     * @class TList
     * @namespace zn.util
     **/

    zn.Class('zn.data.TList', {
        statics: {
            getInstance: function (args){
                return new this(args);
            }
        },
        properties: {
            min: 0,
            max: 100,
            TClass: null,
            TClassArgv: {}
        },
        methods: {
            init: function (inArgs) {
                this.sets(inArgs);
                this.reset();
            },
            reset: function (){
                this._data = [];
                for(var i= 0; i < (this.min||0); i++){
                    this.push(this.TClassArgv);
                }
            },
            push: function (tArgs){
                if(this.TClass){
                    var _t = new this.TClass(tArgs||this.TClassArgv);
                    return this._data.push(_t), _t;
                }
            },
            findOneT: function (filter){
                var _one = null,
                    _filter = filter || zn.idle;
                zn.each(this._data, function (one, index){
                    if(_filter(one, index)){
                        _one = one;
                        return -1;
                    }
                });

                return _one;
            },
            findAllT: function (filter){
                var _ones = [],
                    _filter = filter || zn.idle;
                zn.each(this._data, function (one, index){
                    if(_filter(one, index)){
                        _ones.push(one);
                    }
                });

                return _ones;
            }
        }
    });

})(zn);

/**
 * Created by yangyxu on 2014/9/16.
 * Task
 */
(function (zn){

    /**
     * Task
     * @class Task
     * @namespace zn.util
     **/

    zn.Class('zn.data.Task', {
        statics: {
            getInstance: function (args){
                return new this(args);
            },
            PANDING: 0,
            WAITING: 1,
            DOING: 2,
            DONE: 3
        },
        properties: {
            statue: 0
        },
        methods: {
            init: function (inArgs) {
                this.sets(inArgs);
            }
        }
    });

})(zn);

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

/**
 * Created by yangyxu on 2015/7/28.
 * Binding
 */
(function (zn){

    var Binding = zn.Class({
        properties: {
            direction: {
                value: 'oneway',
                readonly: true
            },
            target: {
                value: null,
                readonly: true
            },
            targetPath: {
                value: '',
                readonly: true
            },
            source: {
                get: function (bindingOwner) {
                    return bindingOwner ? this._owner : this._source;
                },
                set: function (value) {
                    this._source = value;
                    this.__rebind();
                }
            },
            sourcePaths: {
                get: function () {
                    return this._sourcePaths;
                },
                set: function (value) {
                    this._sourcePaths = this.__parseSourcePaths(value, function (bindingOwner, path){
                        if(bindingOwner){
                            this.__rebind();
                        }
                    }.bind(this));
                }
            },
            owner: {
                get: function () {
                    return this._owner;
                }
            },
            converter: {
                value: null
            },
            async: {
                value: false
            }
        },
        methods: {
            init: function (target, targetPath, options) {
                var _options = options || {},
                    _member = target.member(targetPath),
                    _bindingMeta = (_member && _member.meta.binding) || {},
                    _self = this;

                zn.overwrite(_options, {
                    direction: 'oneway',
                    converter: { },
                });

                var _direction = this._direction = _options.direction;
                this._source = _options.source;
                this._sourcePaths = this.__parseSourcePaths(_options.sourcePaths);
                this._owner = _options.owner || target;
                this._converter = this.__parseConverter(_options);

                this._target = target;
                this._targetPath = targetPath;

                if (_direction === 'twoway' || _direction === 'oneway') {
                    this.__rebind();
                }

                if (_direction === 'twoway' || _direction === 'inverse') {
                    target.watch(targetPath, function (value) {
                        this.__updateSource(value);
                    }, this);
                }
            },
            dispose: function () {
                this._source = null;
                this.__rebind();
            },
            __updateSource: function (value){
                var _converter = this._converter,
                    _value = null;

                zn.each(this.sourcePaths, function (path){
                    _value = _converter.revert.call(_converter.context, value);
                    zn.path(this.get('source', path[0]), path[1], _value);
                }, this);

                return this;
            },
            __updateTarget: function (){
                var _self = this,
                    _values = [],
                    _value = null,
                    _owner = this._owner,
                    _target = this._target,
                    _targetPathValue = null,
                    _targetPath = this._targetPath,
                    _converter = this._converter;

                zn.each(this.sourcePaths, function (path){
                    _value = zn.path(_self.get('source', path[0]), path[1]);
                    _value = zn.is(_value, 'function') ? _value.bind(_owner) : _value;
                    _values.push(_value);
                });

                _targetPathValue = _converter.convert.apply(_converter.context, _values);

                return _target.set(_targetPath, _targetPathValue), this;
            },
            __rebind: function () {
                var _sourcePaths = this._sourcePaths,
                    _watchers = this._watchers;

                if (_watchers) {
                    zn.each(_watchers, function (watch){
                        watch.source.unwatch(watch.path, watch.handler);
                    });
                    this._watchers = null;
                }

                zn.each(_sourcePaths, function (path){
                    var _bindingOwner = path[0],
                        _path = path[1],
                        _source = this.get('source', _bindingOwner);

                    if(zn.can(_source, 'watch')){
                        _source.watch(_path, this.__updateTarget.bind(this));
                        _watchers = _watchers||[];
                        _watchers.push({
                            source: _source,
                            path: _path,
                            handler: this.__updateTarget
                        });
                    }
                }, this);

                return this.__updateTarget();
            },
            __parseSourcePaths: function (sourcePaths, callback){
                var _paths = sourcePaths.split(','),
                    _path = '',
                    _bindingOwner = false;

                for(var i= 0, _len = _paths.length; i < _len; i++){
                    _path = _paths[i].trim();
                    if(_path.charAt(0) === '#'){
                        _path = _path.substring(1);
                        _bindingOwner = true;
                    }
                    _paths[i] = [_bindingOwner, _path];
                    if(callback){
                        callback(_bindingOwner, _path);
                    }
                }

                return _paths;
            },
            __parseConverter: function (options){
                var _converter = options.converter;
                if(zn.is(_converter, 'string') || zn.is(_converter, 'function')){
                    _converter = {
                        convert: _converter
                    };
                }
                var _convert = _converter.convert = options.convert || _converter.convert  || function (value){ return value; };
                _converter.revert = options.revert || function (value) { return value; };
                _converter.context = options.context || this.owner;

                if(zn.is(_convert, 'string')){
                    var _index =  _convert.lastIndexOf('.'),
                        _key = _convert,
                        _context = this.source || this.owner,
                        _subPath = '';

                    if(_index>0){
                        _subPath = _convert.slice(0, _index);
                        _key = _convert.slice(_index + 1);
                        _context = zn.path(this.source, _subPath);
                    }

                    _convert = _context && _context[_key];
                }

                return _converter.convert = _convert, _converter;
            }
        }
    });

    /**
     * @class Bindable
     * @namespace zn.data.Bindable
     * @type {Function}
     * @return {Function}
     */
    var Bindable = zn.Class('zn.data.Bindable', zn.data.Observable, {
        statics: {
            parseOptions: function (value, owner) {
                var _value = null;
                if (typeof value === 'string' && value.charAt(0) === '{' && value.charAt(value.length - 1) === '}') {

                    var _expr = value.slice(1, -1),
                        _tokens = _expr.split(';');

                    _value = {
                        owner: owner,
                        sourcePaths: _tokens.shift()
                    };

                    zn.each(_tokens, function (token) {
                        if(!token){ return -1; }
                        var _option = token.split('=');
                        _value[_option[0]] = _option[1];
                    });
                }
                else if (typeof value === 'object') {
                    _value = value;
                }

                return _value;
            }
        },
        properties: {
            model: {
                get: function () {
                    return this._model;
                },
                set: function (value) {
                    this._model = value;
                    zn.each(this.__bindings__, function (binding) {
                        binding.set('source', value);
                    });
                }
            }
        },
        methods: {
            init: {
                auto: true,
                value: function () {
                    this.__bindings__ = {};
                },
                after: function (){
                    this.__binding();
                }
            },
            dispose: function () {
                this.super();
                zn.each(this.__bindings__, function (binding) {
                    binding.dispose();
                });
                this.__bindings__ = null;
            },
            let: function (name, value, owner, target) {
                var _binding = Bindable.parseOptions(value);
                if (_binding) {
                    _binding.owner = owner;
                    this.setBinding(name, _binding, target);
                }
                else {
                    this.set(name, value);
                }
            },
            getBinding: function (name) {
                return this.__bindings__[name];
            },
            setBinding: function (name, options, target) {
                options.source = options.model || this.get('model');
                options.owner = options.owner || this;
                this.clearBinding(name);
                this.__bindings__[name] = new Binding(target || this, options.targetPath || name, options);
                return this;
            },
            clearBinding: function (name) {
                var binding = this.__bindings__[name];
                if (binding) {
                    binding.dispose();
                    delete this.__bindings__[name];
                }
            },
            __binding: function (){
                var _self = this,
                    _properties = this.constructor.getMeta('properties');

                zn.each(_properties, function (value, key){
                    if(value && value.binding){
                        _self.let(key, value.binding);
                    }
                });
            }
        }
    });

})(zn);

(function (zn) {

    var Map = zn.Class('zn.data.Map', {
        properties: {
            /**
             * @property length
             * @type {Number}
             */
            count: {
                get: function () {
                    var length = 0;
                    this.each(function () {
                        length++;
                    });

                    return length;
                }
            },
            /**
             * @property keys
             * @type {Array}
             */
            keys: {
                get: function () {
                    return Object.keys(this._map);
                },
                set: function (){
                    throw new Error("Unable to set keys of Map");
                }
            },
            /**
             * @property values
             * @type {Array}
             */
            values: {
                get: function () {
                    return this.__getMapValues();
                },
                set: function (){
                    throw new Error("Unable to set values of Map");
                }
            }
        },
        methods: {
            init: {
                auto: true,
                value: function (map) {
                    this._map = {};
                    this.concat(map);
                }
            },
            concat: function (map){
                if (map) {
                    var _map = this._map,
                        _self = this;
                    zn.each(map, function (value, key) {
                        _self.set(key, value);
                    });
                }

                return this;
            },
            /**
             * @method contains
             * @param key {String}
             * @returns {Boolean}
             */
            contains: function (key) {
                return key in this._map;
            },
            /**
             * @method getItem
             * @param key {String}
             * @returns {*}
             */
            getItem: function (key) {
                return this._map[key];
            },
            /**
             * @method get
             * @param key {String}
             * @returns {*}
             */
            get: function (key) {
                if(this.has(key)){
                    return this.super(key);
                }

                var _item = this.getItem(key);
                return _item && _item.value;
            },
            /**
             * @method set
             * @param key {String}
             * @param value {any}
             */
            set: function (key, value) {
                if(this.has(key)){
                    return this.super(key);
                }

                var _key = key,
                    _item = this._map[_key];

                if (!_item) {
                    _item = this._map[_key] = {
                        key: _key
                    };
                }

                return _item.value = value, this;
            },
            /**
             * @method remove
             * @param key {String}
             */
            remove: function (key) {
                return delete this._map[key], this;
            },
            /**
             * @method clear
             */
            clear: function () {
                return this._map = {}, this;
            },
            /**
             * @method each
             * @param callback {Function}
             * @param [context] {Object}
             */
            each: function (callback, context) {
                return zn.each(this._map, callback, context), this;
            },
            eachKey: function (callback, context){
                return zn.each(this.keys, callback, context), this;
            },
            eachValue: function (callback, context){
                return zn.each(this.values, callback, context), this;
            },
            /**
             * @method toArray
             * @returns {Array}
             */
            toArray: function () {
                var _data = [];
                this.each(function (item) {
                    _data.push(item);
                });

                return _data;
            },
            /**
             * @method toObject
             * @returns {Object}
             */
            toObject: function () {
                var _data = {};
                this.each(function (item) {
                    _data[item.key] = item.value;
                });

                return _data;
            },
            __getMapValues: function () {
                var _data = [];
                this.each(function (item) {
                    _data.push(item.value);
                });

                return _data;
            }
        }
    });

})(zn);

(function (zn) {

    zn.Class('zn.data.ObservableList', zn.data.List, {
        mixins: [ zn.data.Observable ],
        events: ['change'],
        methods: {
            /**
             * Add an item.
             * @method add
             * @param item
             */
            add: function (item) {
                var _index = this.super(item);
                this.notify('count');
                this.fire('change', {
                    action: 'add',
                    items: [ item ],
                    index: _index
                });

                return _index;
            },
            /**
             * @method addRange
             * @param data
             */
            addRange: function (data) {
                var _index = this.super(data);
                this.notify('count');
                this.fire('change', {
                    action: 'add',
                    items: data,
                    index: _index
                });

                return _index;
            },
            /**
             * @method insert
             * @param item
             * @param index
             */
            insert: function (item, index) {
                this.super(item, index);
                this.notify('count');
                this.fire('change', {
                    action: 'add',
                    items: [ item ],
                    index: index
                });

                return index;
            },
            /**
             * @method insertRange
             * @param data
             * @param index
             */
            insertRange: function (data, index) {
                this.super(data, index);
                this.notify('count');
                this.fire('change', {
                    action: 'add',
                    items: data,
                    index: index
                });

                return index;
            },
            /**
             * @method remove
             * @param item
             */
            remove: function (item) {
                var _index = this.super(item);
                if (_index >= 0) {
                    this.notify('count');
                    this.fire('change', {
                        action: 'remove',
                        items: [ item ],
                        index: _index
                    });
                }

                return index;
            },
            /**
             * @method removeAt
             * @param index
             */
            removeAt: function (index) {
                var _item = this.super(index);
                if (_item !== undefined) {
                    this.notify('count');
                    this.fire('change', {
                        action: 'remove',
                        items: [ _item ],
                        index: index
                    });
                }

                return _item;
            },
            /**
             * @method clear
             */
            clear: function () {
                var _items = this.super();
                this.notify('count');
                this.fire('change', {
                    action: 'clear',
                    items: _items
                });

                return _items;
            },
            /**
             * @method sort
             * @param callback
             */
            sort: function (callback) {
                var _items = this.super(callback);
                this.notify('count');
                this.fire('change', {
                    action: 'sort',
                    sort: callback || function (a, b) {
                        if (a > b) {
                            return 1;
                        }
                        else if (a < b) {
                            return -1;
                        }
                        else {
                            return 0;
                        }
                    }
                });

                return _items;
            }
        }
    });

})(zn);

(function (zn) {

    zn.Class('zn.data.ObservableMap', zn.data.Map, {
        mixins: [ zn.data.Observable ],
        events: [ 'change' ],
        methods: {
            set: function (key, value) {
                if(this.has(key)){
                    return this.super(key);
                }

                var _map = this._map,
                    _item = {
                        key: key,
                        value: value
                    };

                if (key in _map) {
                    var _old = _map[key];
                    _map[key] = _item;
                    this.fire('change', {
                        action: 'replace',
                        oldItem: _old,
                        newItem: _item
                    });
                }
                else {
                    _map[key] = _item;
                    this.notify('count');
                    this.fire('change', {
                        action: 'add',
                        items: [ _item ]
                    });
                }
            },
            remove: function (key) {
                var _map = this._map;
                if (key in _map) {
                    var _item = _map[key];
                    delete _map[key];
                    this.notify('count');
                    this.fire('change', {
                        action: 'remove',
                        items: [ _item ]
                    });
                }
            },
            clear: function () {
                var _items = this.toArray();
                this.super();
                this.notify('count');
                this.fire('change', {
                    action: 'clear',
                    items: this.toArray()
                });

                return this;
            }
        }
    });

})(zn);
