/**
 * Global Var
 */
var zn = {
    VERSION: '0.0.1',
    DEBUG: false,
    ZN_PATH: '',
    PATH: '',
    GLOBAL: (function () { return this; }).call(null)
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = zn;
    zn.ZN_PATH = __dirname;
    zn.PATH = process.cwd();
}else{
    var _zn_url = '';
    try{
        __a__ = __b__;
    }
    catch(e){
        if(e.fileName){   //firefox
            _zn_url = e.fileName;
        }
        else if(e.sourceURL){  //safair
            _zn_url = e.sourceURL;
        }
        else if(e.stacktrace){  //opera
            console.log(e.stacktrace);
        }
        else if(e.stack){  //chrome
            _zn_url = e.stack.split('\n')[1];
            _zn_url = _zn_url.replace(/\s/g,"");
            _zn_url = _zn_url.substring(2, _zn_url.length);
        }
        else {
            console.log(e.toString());
        }
    }
    if(!_zn_url){
        var _scripts = document.getElementsByTagName("script"),
            _src = '',
            _node;

        for(var i = 0 , _len = scripts.length; i < _len; i++){
            _node = scripts[i];
            if(_node.getAttribute){
                _src = _node.getAttribute('src') || '';
                if (_src.slice(-5) === 'zn.js'||_src.slice(-10) === 'zn.minx.js') {
                    _zn_url = _src;
                    break;
                }
            }
        }
    }

    if(_zn_url){
        zn.ZN_PATH = _zn_url.substring(0, _zn_url.lastIndexOf('/') + 1);
    }else {
        throw new Error('zn.js has not been included, please do it first.');
    }
}

zn.GLOBAL.zn = zn;  //set global zn var
/**
 * Builtin Functions
 */
(function (zn) {
    var __toString = Object.prototype.toString;

    var __builtin__ = {
        idle: function (){
            // empty handler
        },
        idleArray: function () {
            return [];
        },
        idleObject: function () {
            return {};
        },
        uuid: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            }).toUpperCase();
        },
        fix: function (target){
            var _target = target||{};
            for (var i = 1, _len = arguments.length; i < _len; i++) {
                var _fix = arguments[i];
                for (var _key in _fix) {
                    if (_fix.hasOwnProperty(_key) && typeof _target[_key] !== 'function') {
                        _target[_key] = _fix[_key];
                    }
                }
            }

            return _target;
        },
        extend: function (target){
            var _target = target||{};
            for (var i = 1, _len = arguments.length; i < _len; i++) {
                var _args = arguments[i];
                for (var _key in _args) {
                    if (_args.hasOwnProperty(_key)) {
                        _target[_key] = _args[_key];
                    }
                }
            }

            return _target;
        },
        overwrite: function (target){
            var _target = target||{};
            for(var i = 1, _len = arguments.length; i < _len; i++){
                var _args = arguments[i];
                for(var _key in _args){
                    if(_args.hasOwnProperty(_key) && _target[_key]===undefined){
                        _target[_key] = _args[_key];
                    }
                }
            }

            return _target;
        },
        path: function (target, path, value) {
            var _result = target||{};
            if (path) {
                var _tokens = path.split('.'),
                    _token,
                    _len = _tokens.length,
                    i = 0;

                if (arguments.length < 3) {
                    for (; _result && i < _len; i++) {
                        _token = _tokens[i];
                        if (_result.__get__) {
                            _result = _result.__get__(_token);
                        } else {
                            _result = _result[_token];
                        }
                    }
                } else {
                    _len -= 1;
                    for (; _result && i < _len; i++) {
                        _token = _tokens[i];
                        if (_result.__get__) {
                            _result = _result.__get__(_token);
                        } else {
                            _result = _result[_token] = _result[_token] || {};
                        }
                    }

                    _token = _tokens[i];
                    if (_result) {
                        if (_result.__set__) {
                            _result.__set__(_token, value);
                        } else {
                            _result[_token] = value;
                        }

                        _result = value;
                    }
                }
            }

            return _result;
        },
        invoke: function (target, path, args) {
            if (target && path) {
                var _index = path.lastIndexOf('.'),
                    _context,
                    _method;

                if (_index > 0) {
                    _context = zn.path(target, path.substring(0, _index));
                    if (_context) {
                        _method = _context[path.substring(_index + 1)];
                    }
                } else {
                    _context = target;
                    _method = target[path];
                }

                if (_method) {
                    _method.apply(_context, args);
                }
            }
        }
    };

    var __builtinZNObject__ = {
        toString: function (target){
            if(target&&target.toString){
                return target.toString();
            } else {
                return __toString.call(target);
            }
        },
        each: function (target, callback, context) {
            if (target && callback) {
                if(target.__each__){
                    target.__each__(callback, context);
                } else {
                    var _len = target.length,
                        _callBackValue = null;
                    if (_len > 0 && __toString.call(target) === '[object Array]') {
                        for (var i = 0; i < _len; i++) {
                            _callBackValue = callback.call(context, target[i], i);
                            if(_callBackValue===false){
                                return false;
                            }
                            if(_callBackValue===-1){
                                continue;
                            }
                        }
                    } else {
                        for (var _key in target) {
                            if (target.hasOwnProperty(_key)) {
                                _callBackValue = callback.call(context, target[_key], _key);
                                if(_callBackValue===false){
                                    return false;
                                }
                                if(_callBackValue===-1){
                                    continue;
                                }
                            }
                        }
                    }
                }
            }
        },
        clone: function (target) {
            if (target) {
                if (target.__clone__){
                    return target.__clone__();
                } else {
                    if (zn.is(target, 'array')) {
                        return target.slice(0);
                    } else {
                        var _result = {};
                        for (var key in target) {
                            if (target.hasOwnProperty(key)) {
                                _result[key] = target[key];
                            }
                        }

                        return _result;
                    }
                }
            } else {
                return target;
            }
        },
        type: function (target) {
            if (target && target.__type__) {
                return target.__type__;
            } else {
                return __toString.call(target).slice(8, -1).toLowerCase();
            }
        },
        is: function (target, type) {
            if (target && target.__is__) {
                return target.__is__(type);
            } else {
                if (typeof type === 'string') {
                    switch (type.toLowerCase()) {
                        case 'plain':
                            return target && target.constructor === Object;
                        default:
                            return this.type(target) === type;
                    }
                } else if (typeof type === 'function') {
                    return target instanceof type;
                }
            }
        },
        may: function (target, name) {
            if (target) {
                if (target.__may__) {
                    return target.__may__(name);
                } else {
                    return target.hasOwnProperty('on' + name);
                }
            } else {
                return false;
            }
        },
        can: function (target, name) {
            if (target) {
                if (target.__can__) {
                    return target.__can__(name);
                } else {
                    return typeof target[name] === 'function';
                }
            } else {
                return false;
            }
        },
        has: function (target, name) {
            if (target) {
                if (target.__has__) {
                    return target.__has__(name);
                } else {
                    return target.hasOwnProperty(name);
                }
            } else {
                return false;
            }
        },
        get: function (target, name) {
            if (target) {
                if (target.__get__) {
                    return target.__get__(name);
                } else {
                    return target[name];
                }
            }
        },
        set: function (target, name, value) {
            if (target) {
                if (target.__set__) {
                    target.__set__(name, value);
                } else {
                    target[name] = value;
                }
            }
        },
        gets: function (target) {
            if (target) {
                if (target.__gets__) {
                    return target.__gets__();
                } else {
                    var _values = {};
                    for (var _key in target) {
                        if (target.hasOwnProperty(_key)) {
                            _values[_key] = target[_key];
                        }
                    }

                    return _values;
                }
            }
        },
        sets: function (target, values) {
            if (target && values) {
                if (target.__sets__) {
                    target.__sets__(values);
                } else {
                    for (var _key in values) {
                        if (values.hasOwnProperty(_key)) {
                            target[_key] = values[_key];
                        }
                    }
                }
            }
        }
    };

    __builtin__.extend(zn, __builtin__);
    __builtin__.extend(zn, __builtinZNObject__);

})(zn);
/**
 * Fix Javascript Object Functions
 */
(function (zn){

    var __slice = Array.prototype.slice,
        __hasOwnProperty = Object.prototype.hasOwnProperty,
        __toString = Object.prototype.toString;



    var __fixArray__ = {
        isArray: function (target){
            /*
             * Two solution of fix Array function
             * 1, return Object.prototype.toString.call(target) === '[object Array]';
             * 2, return target&&target.constructor === Array;
             * */
            return target && zn.toString(target) === '[object Array]' && target.constructor === Array;
        }
    };

    var __fixArrayPrototype__ = {
        forEach: function (iterator, context){
            if(!iterator){ return false; }
            for(var i= 0, _len = this.length; i < _len; i++){
                iterator.call(context, this[i], i);
            }

            return this;
        },
        toJSON: function (){
            var _data = {};
            for(var i= 0, _len = this.length; i < _len; i++){
                _data[i] = this[i];
            }

            return _data;
        },
        indexOf: function (item){
            for(var i= 0, _len = this.length; i < _len; i++){
                if (this[i] === item){
                    return i;
                }
            }

            return -1;
        },
        lastIndexOf: function (item){
            for(var i= this.length - 1; i >= 0; i--){
                if (this[i] === item){
                    return i;
                }
            }

            return -1;
        }
    };

    var __fixFunction__ = {
        bind: function (context){
            var _self = this;
            return function (){
                return _self.apply(context, __slice.call(arguments, 1));
            };
        }
    };

    var __fixObject__ = {
        toArray: function (target){
            return __slice.call(target);
        },
        keys: function (obj){
            if(obj !== Object(obj)){
                throw new TypeError('Object.keys called on a non-object');
            }
            var _keys = [], _property;
            for (_property in obj){
                if(__hasOwnProperty.call(obj, _property)){
                    _keys.push(_property);
                }
            }

            return _keys;
        },
        values: function (obj){
            if(obj !== Object(obj)){
                throw new TypeError('Object.keys called on a non-object');
            }
            var _values = [], _property;
            for (_property in obj){
                if(__hasOwnProperty.call(obj, _property)){
                    _values.push(obj[_property]);
                }
            }

            return _values;
        },
        create: (function (){
            var _object = function (){}, _self = this;
            return function (obj, properties){
                if (obj === null){
                    throw new Error('Cannot set a null [[Prototype]]');
                }

                if (typeof obj !== 'object'){
                    throw new TypeError('Argument must be an object');
                }
                zn.each(properties, function (property, descriptor){
                    __fixObject__.defineProperty(obj, property, descriptor);
                });
                _object.prototype = obj;
                return new _object();
            };
        })(),
        defineProperty: function (obj, property, descriptor){
            if (obj && property && descriptor && descriptor.hasOwnProperty('value')) {
                obj[property] = descriptor.value;
            }

            return obj;
        }
    };

    var __fixJSON__ = {
        parse: function (value){
            return ''; //eval('(' + value + ')');
        },
        stringify: (function () {
            var _toString = __toString;
            var _isArray = Array.isArray;
            var _escMap = {
                '"': '\\"',
                '\\': '\\\\',
                '\b': '\\b',
                '\f': '\\f',
                '\n': '\\n',
                '\r': '\\r',
                '\t': '\\t'
            };
            var _escFunc = function (m) {
                return _escMap[m] || '\\u' + (m.charCodeAt(0) + 0x10000).toString(16).substr(1);
            };
            var _escRE = /[\\"\u0000-\u001F\u2028\u2029]/g;
            return function stringify(value) {
                if (value == null) {
                    return 'null';
                } else if (typeof value === 'number') {
                    return isFinite(value) ? value.toString() : 'null';
                } else if (typeof value === 'boolean') {
                    return value.toString();
                } else if (typeof value === 'object') {
                    var _values;
                    if (typeof value.toJSON === 'function') {
                        return stringify(value.toJSON());
                    } else if (_isArray(value)) {
                        _values = '[';
                        for (var i = 0; i < value.length; i++){
                            _values += (i ? ', ' : '') + stringify(value[i]);
                        }
                        return _values + ']';
                    } else if (_toString.call(value) === '[object Object]') {
                        _values = [];
                        for (var key in value) {
                            if (value.hasOwnProperty(key)){
                                _values.push(stringify(key) + ': ' + stringify(value[key]));
                            }
                        }
                        return '{' + _values.join(', ') + '}';
                    }
                }

                return '"' + value.toString().replace(_escRE, _escFunc) + '"';
            };
        })()
    };

    zn.fix(Array, __fixArray__);
    zn.fix(Array.prototype, __fixArrayPrototype__);
    zn.fix(Function.prototype, __fixFunction__);
    //zn.fix(Object, __fixObject__);
    zn.fix(zn.GLOBAL.JSON, __fixJSON__);

    try {
        Object.defineProperty({}, 'zn', {});
    }
    catch (ex) {
        Object.defineProperty = function (obj, property, descriptor) {
            return __fixObject__.defineProperty(obj, property, descriptor);
        };
    }

})(zn);
/**
 * Define Class
 */
(function (zn) {
    /* *
    * Class and Instance member named format splicity:
    *
    * 1: class member format: _member_,
    *   you can get class member by this._member_, such as this._id_
    * 2: instance member format: __member__,
    *   you can get instance member by this.__member__, such as this.__id__
    *
    * */

    var GLOBAL = zn.GLOBAL,
        MEMBER_PREFIX = '@',
        _id_ = 1,  /*class id var*/
        __id__ = 1;  /*instance id var*/

    var __define = {
        /**
         * Get target's constructor
         * @param target
         * @returns {*}
         */
        fixTargetCtor: function (target){
            return ( target instanceof ZNObject ) ? target.constructor: target;
        },
        /**
         * Get member key by name.
         * @param name
         * @returns {string}
         */
        fixTargetKey: function (name){
            return MEMBER_PREFIX + name;
        },
        /**
         * Define an event for target
         * @param target
         * @param name
         * @param meta
         * @returns {boolean}
         */
        defineEvent: function (target, name, meta){
            var _ctor = __define.fixTargetCtor(target),
                _key = __define.fixTargetKey(name),
                _exist = _key in _ctor,
                _descriptor = {};

            if(!_exist){
                _descriptor = Object.defineProperty(target, 'on' + name.toLowerCase(), {
                    get: function () {
                        var _listeners = this.__handlers__[name];
                        if (_listeners) {
                            return _listeners[0].handler;
                        }
                        else {
                            return null;
                        }
                    },
                    set: function (value) {
                        var _handlers = this.__handlers__;
                        var _listeners = _handlers[name] = _handlers[name] || [];

                        _listeners[0] = {
                            owner: this,
                            handler: value,
                            context: null
                        };
                    }
                });
            }
            _ctor[_key] = {
                name: name,
                type: 'event',
                meta: meta,
                descriptor: _descriptor
            };

            return _exist;
        },
        /**
         * Define a property for target
         * @param target
         * @param name
         * @param meta
         * @returns {boolean}
         */
        defineProperty: function (target, name, meta){
            var _ctor = __define.fixTargetCtor(target),
                _key = __define.fixTargetKey(name),
                _exist = _key in _ctor,
                _descriptor = {};
            var _getter, _setter;

            if ('value' in meta) {
                var _value = meta.value,
                    _field = '_' + name,
                    _get = meta.get,
                    _set = meta.set;

                _getter = _get || function () {
                    if (_field in this) {
                        return this[_field];
                    }
                    else {
                        return zn.is(_value, 'function') ? _value.call(this) : _value;
                    }
                };
                _setter = meta.readonly ?
                    function (value, options) {
                        if (options && options.force) {
                            this[_field] = value;
                        }
                        else {
                            return false;
                        }
                    } :
                    (_set ||function (value) {
                        this[_field] = value;
                    });
            } else {
                _getter = meta.get || function () {
                    return undefined;
                };
                _setter = meta.set || function () {
                    return false;
                };
            }

            if (_exist) {
                _getter.__super__ = _ctor[_key].getter;
                _setter.__super__ = _ctor[_key].setter;
            }

            /*
            if(!_exist){
                _descriptor = Object.defineProperty(target, name, {
                    get: _getter,
                    set: _setter,
                    configurable : true
                });
            }*/


            _descriptor = Object.defineProperty(target, name, {
                get: _getter,
                set: _setter,
                configurable : true
            });

            _ctor[_key] = {
                name: name,
                type: 'property',
                meta: meta,
                getter: _getter,
                setter: _setter,
                descriptor: _descriptor
            };

            return _exist;
        },
        /**
         * Define a method for target
         * @param target
         * @param name
         * @param meta
         * @returns {boolean}
         */
        defineMethod: function (target, name, meta){
            var _ctor = __define.fixTargetCtor(target),
                _key = __define.fixTargetKey(name),
                _exist = _key in _ctor;

            _ctor[_key] = {
                name: name,
                type: 'method',
                meta: meta
            };

            if (name in target) {
                meta.value.__super__ = target[name];
            }

            target[name] = meta.value;

            return _exist;
        }
    };

    var sharedMethods = {
        __handlers__: {},

        /**
         * Get specified member.
         * @param name
         * @returns {*}
         */
        member: function (name, target) {
            var _ctor = __define.fixTargetCtor(target||this),
                _member = _ctor[__define.fixTargetKey(name)];

            if(!_member&&_ctor!==ZNObject){
                return this.member(name, _ctor._super_);
            }

            return _member;
        },
        /**
         * Check whether current object has specified event.
         * @method may
         * @param name {String}
         * @returns {Boolean}
         */
        may: function (name) {
            var _member = this.member(name);
            return _member && _member.type == 'event';
        },
        /**
         * Check whether current object has specified property.
         * @method has
         * @param name {String}
         * @returns {Boolean}
         */
        has: function (name) {
            var _member = this.member(name);
            return _member && _member.type == 'property';
        },
        /**
         * Check whether current object has specified method.
         * @method can
         * @param name {String}
         * @returns {Boolean}
         */
        can: function (name) {
            var _member = this.member(name);
            return _member && _member.type == 'method';
        },
        /**
         * Get specified property value.
         * @method get
         * @param name {String}
         * @param [options] {Any}
         * @returns {*}
         */
        get: function (name, options) {
            var _member = this.member(name);
            if(_member && _member.getter){
                return _member.getter.call(this, options);
            }

            return undefined;
        },
        /**
         * Set specified property value.
         * @method set
         * @param name {String}
         * @param value {*}
         * @param [options] {Any}
         */
        set: function (name, value, options) {
            var _member = this.member(name);
            if (_member && _member.setter) {
                _member.setter.call(this, value, options);
            }

            return this;
        },
        /**
         * Get all properties.
         * @method gets
         * @returns {Object}
         * @param [options] {Any}
         */
        gets: function (options) {
            var _values = {},
                _properties = __define.fixTargetCtor(this)._properties_;
            zn.each(_properties, function (name) {
                _values[name] = this.get(name, options);
            }, this);

            return _values;
        },
        /**
         * Set a bunch of properties.
         * @method sets
         * @param dict {Object}
         * @param [options] {Any}
         */
        sets: function (values, options) {
            if (values) {
                for (var _name in values) {
                    if (values.hasOwnProperty(_name)) {
                        this.set(_name, values[_name], options);
                    }
                }
            }

            return this;
        },
        each: function (callback, context){
            var _properties = __define.fixTargetCtor(this)._properties_;
            for(var i= 0, _len = _properties.length; i<_len; i++){
                var _property = _properties[i];
                var _callback = callback.call(context, _property, i, this.member(_property), this.get(_property));
                if(_callback === false){
                    return false;
                }
                if(_callback === -1){
                    continue;
                }
            }

            return this;
        },
        __may__: function (name) {
            return this.may(name);
        },
        __has__: function (name) {
            return this.has(name);
        },
        __can__: function (name) {
            return this.can(name);
        },
        __get__: function (name) {
            return this.get(name);
        },
        __gets__: function () {
            return this.gets();
        },
        __set__: function (name, value) {
            this.set(name, value);
        },
        __sets__: function (values) {
            this.sets(values);
        },
        __each__: function (callback, context){
            return this.each(callback, context);
        }
    };

    var classMethods = {
        toString: function (){
            return '{ ClassName: ' + (this._name_ || 'Anonymous') + ', ClassID: ' + this._id_ + ' }';
        },
        /**
         * Get the meta data of the class.
         * @param name
         * @returns {*}
         */
        getMeta: function (name) {
            return name ? this._meta_[name]: this._meta_;
        },
        /**
         * Get the meta data of the class.
         * @param name
         * @param value
         * @returns {*}
         */
        setMeta: function (name, value) {
            return this._meta_[name] = value, this;
        },
        /**
         * Define an event.
         * @method defineEvent
         * @static
         * @param name {String}
         * @param [meta] {Object}
         * @param [target] {Object}
         */
        defineEvent: function (name, meta, target) {
            if (!__define.defineEvent(target || this.prototype, name, meta)) {
                this._events_.push(name);
            }

            return this;
        },
        /**
         * Define a property.
         * @method defineProperty
         * @static
         * @param name {String}
         * @param [meta] {Object}
         * @param [target] {Object}
         */
        defineProperty: function (name, meta, target) {
            if (!__define.defineProperty(target || this.prototype, name, meta)) {
                this._properties_.push(name);
            }

            return this;
        },
        /**
         * Define a method.
         * @method defineMethod
         * @static
         * @param name {String}
         * @param meta {Object}
         * @param [target] {Object}
         */
        defineMethod: function (name, meta, target) {
            if (!__define.defineMethod(target || this.prototype, name, meta)) {
                this._methods_.push(name);
            }

            return this;
        }
    };

    var instanceMethods = {
        /**
         * Instance Object to string value.
         * @returns {string}
         */
        toString: function (){
            return '{ ClassName: ' + (this.__name__ || 'Anonymous') + ', InstanceID: ' + this.__id__ + ' }';
        },
        /**
         * Add a single event handler.
         * @method upon
         * @param name {String}
         * @param handler {Function}
         * @param [options] {Object}
         */
        upon: function (name, handler, options) {
            if (handler) {
                var _handlers = this.__handlers__;
                var _listeners = _handlers[name] = _handlers[name] || [];

                _listeners[0] = zn.extend({
                    owner: this,
                    handler: handler
                }, options);
            }

            return this;
        },
        /**
         * Add an event handler.
         * @method on
         * @param name {String}
         * @param handler {Function}
         * @param [options] {Object}
         */
        on: function (name, handler, options) {
            if (handler) {
                var _handlers = this.__handlers__;
                var _listeners = _handlers[name] = _handlers[name] || [
                    {
                        owner: null,
                        handler: null,
                        context: null
                    }
                ];

                _listeners.push(zn.extend({
                    owner: this,
                    handler: handler
                }, options));
            }

            return this;
        },
        /**
         * Remove an event handler.
         * @method off
         * @param name {String}
         * @param [handler] {Function}
         * @param [options] {Object}
         */
        off: function (name, handler, options) {
            var _listeners = this.__handlers__[name]||[], _listener;
            var _context = options && options.context;
            if (handler) {
                for (var i = _listeners.length - 1; i >= 0; i--) {
                    _listener = _listeners[i];
                    if (_listener.handler === handler && (!_context || _listener.context === _context )) {
                        this.__handlers__[name].splice(i, 1);
                    }
                }
            }
            else {
                this.__handlers__[name] = [
                    {
                        owner: null,
                        handler: null,
                        context: null
                    }
                ];
            }

            return this;
        },
        /**
         * Trigger an event.
         * @method fire
         * @param name {String}
         * @param [data] {*}
         * @param [options] {Object}
         */
        fire: function (name, data, options) {
            var _listeners = this.__handlers__[name], _listener;
            if (_listeners) {
                for (var i = 0, length = _listeners.length; i < length; i++) {
                    _listener = _listeners[i];
                    if (_listener && _listener.handler) {
                        if (false === _listener.handler.call(_listener.context || _listener.owner, _listener.owner, data, options)) {
                            return false;
                        }
                    }
                }
            }

            return this;
        },
        /**
         * Dispose current object.
         * @method dispose
         */
        dispose: function () {
            return this.__handlers__ = {}, this;
        },
        /**
         * Destroy current object.
         * @method destroy
         */
        destroy: function () {
            return this.dispose();
        },
        /**
         * Call overridden method from super class
         * @method super
         */
        super: function () {
            var _superMethod = this.super.caller.__super__;
            if (_superMethod) {
                return _superMethod.apply(this, arguments);
            }
        },
        /**
         * Check whether current object is specified type.
         * @method is
         * @param type {String|Function}
         * @returns {Boolean}
         */
        is: function (type) {
            if (typeof type === 'string') {
                type = zn.path(GLOBAL, type);
            }

            if (type) {
                if (this instanceof type) {
                    return true;
                } else {
                    var _mixins = this.constructor._mixins_;
                    for (var i = 0, _len = _mixins.length; i < _len; i++) {
                        var _mixin = _mixins[i];
                        if (type === _mixin) {
                            return true;
                        }
                    }
                }
            }

            return false;
        },
        __is__: function (type) {
            return this.is(type);
        },
        __clone__: function (){

        }
    };

    /**
     * The default super class for all classes defined in znJS.
     * @private
     */
    function ZNObject() { }

    zn.extend(ZNObject, sharedMethods, classMethods, {
        _id_: 0,
        _name_: 'ZNObject',
        _statics_: {},
        _events_: [],
        _properties_: [],
        _methods_: [],
        _mixins_: [],
        _meta_: {}
    });

    zn.extend(ZNObject.prototype, sharedMethods, instanceMethods);

    var __class = {
        _arguments: function (){
            var _args = arguments,
                _argsLength = _args.length,
                _args0 = _args[0],
                _name, _super, _meta;

            var CLASS_KEYS = {
                'static': false,
                statics: [],
                partial: false,
                abstract: false,
                final: false,
                mixins: [],
                events: [],
                properties: [],
                methods: []
            };

            if (_argsLength === 3) {
                _name = _args0;
                _super = _args[1];
                _meta = _args[2];

                if (!zn.is(_super, 'function')) {
                    throw new Error('Invalid _super class.');
                }

            } else if (_argsLength === 2) {
                if (zn.is(_args0, 'string')) {
                    _name = _args0;
                    _super = null;
                } else if (zn.is(_args0, 'function')) {
                    _name = null;
                    _super = _args0;
                } else {
                    throw new Error('Invalid _super class.');
                }

                _meta = _args[1];

            } else if (_argsLength === 1) {
                _name = null;
                _super = null;
                _meta = _args0;

                if (!zn.is(_meta, 'object')) {
                    throw new Error('The meta argument must be an object.');
                }

            } else {
                throw new Error('Invalid arguments.');
            }

            _name = _name || '';
            _meta = zn.overwrite(_meta || {}, CLASS_KEYS);
            _super = _super || ZNObject;

            return { name: _name, super: _super, meta: _meta };
        },
        _meta: function (_Class, _args){
            var _name = _args.name,
                _super = _args.super,
                _meta = _args.meta;

            zn.extend(_Class, sharedMethods, classMethods, {
                _id_: _id_++,
                _name_: _name,
                _super_: _super,
                _partial_: _meta.partial,
                _abstract_: _meta.abstract,
                _static_: _meta.static,
                _final_: _meta.final,
                _statics_: zn.extend({}, _super._statics_, _meta.statics),
                _events_: _super._events_.slice(0),
                _properties_: _super._properties_.slice(0),
                _methods_: _super._methods_.slice(0),
                _mixins_: _super._mixins_.concat(_meta.mixins),
                _meta_: _meta
            });


            zn.extend(_Class, _Class._statics_);

            if (_meta.static) {
                zn.each(_meta.events, function (event) {
                    _Class.defineEvent(event, {}, _Class);
                });

                zn.each(_meta.properties, function (value, key) {
                    _Class.defineProperty(key, zn.is(value, 'object') ? value : { value: value }, _Class);
                });

                zn.each(_meta.methods, function (value, key) {
                    _Class.defineMethod(key, zn.is(value, 'function') ? { value: value } : value, _Class);
                });

                if (_meta.methods.init) {
                    _meta.methods.init.call(_Class, _Class);
                }
            } else {
                zn.each(_meta.mixins, function (mixin) {
                    var _mixinPrototype = mixin.prototype;
                    zn.each(mixin._events_, function (name) {
                        _Class.defineEvent(name, _mixinPrototype.member(name).meta);
                    });

                    zn.each(mixin._properties_, function (name) {
                        _Class.defineProperty(name, _mixinPrototype.member(name).meta);
                    });

                    zn.each(mixin._methods_, function (name) {
                        if (!sharedMethods[name] && !instanceMethods[name]) {
                            _Class.defineMethod(name, _mixinPrototype.member(name).meta);
                        }
                    });
                });

                zn.each(_meta.events, function (event) {
                    _Class.defineEvent(event, {});
                });

                zn.each(_meta.properties, function (value, key) {
                    _Class.defineProperty(key, zn.is(value, 'object') ? value : { value: value });
                });

                zn.each(_meta.methods, function (value, key) {
                    _Class.defineMethod(key, zn.is(value, 'function') ? { value: value } : value);
                });
            }

            return _Class;
        }
    };

    var __execSuperCtor = function (__super__, __context__, __arguments__){
        if(__super__ && __super__ !== ZNObject){
            var _superCtor = __super__.member('init'),
                _mixins = __super__._mixins_,
                _mixinCtor = null;

            if(_superCtor && _superCtor.meta.after){
                __context__.__afters__.push({
                    context: __context__,
                    handler: _superCtor.meta.after
                });
            }

            if(_mixins.length){
                zn.each(_mixins, function (mixin){
                    if(mixin['@init']){
                        _mixinCtor = mixin['@init'].meta;
                        _mixinCtor = zn.is(_mixinCtor, 'function') ? _mixinCtor : _mixinCtor.value;
                        //__execSuperCtor(mixin.prototype.__super__, mixin.prototype, __arguments__);
                        if (_mixinCtor) {
                            _mixinCtor.call(__context__);
                        }
                    }
                });
            }

            if(_superCtor && _superCtor.meta.auto){
                _superCtor.meta.value.apply(__context__, __arguments__);
            }

            return arguments.callee(__super__._super_, __context__);
        }
    };

    /**
     * Define a class
     * @method define
     * @param [name] {String}
     * @param [super] {Function}
     * @param meta {Object}
     * @returns {Function}
     */
    function define () {
        var _args = __class._arguments.apply(this, arguments);
        var _name = _args.name,
            _super = _args.super,
            _meta = _args.meta,
            _init = _meta.methods.init;

        var ZNClass, _SuperClass, _prototype;

        if (_super._static_) {
            throw new Error('Static class cannot be inherited.');
        }

        if (_super._final_) {
            throw new Error('Final class cannot be inherited.');
        }

        if (_name && _meta.partial) {
            ZNClass = zn.path(GLOBAL, _name);
        }

        if (_meta.static) {
            if (ZNClass) {
                if (!ZNClass._static_) {
                    throw new Error('Partial class "' + _name + '" must be static.');
                }
            } else {
                ZNClass = function () {
                    throw new Error('Cannot instantiate static class.');
                };
            }

            _prototype = ZNClass.prototype;
        } else {
            if (ZNClass) {
                if (ZNClass._static_) {
                    throw new Error('Partial class "' + _name + '" must not be static.');
                }

                if (ZNClass._super_ !== _super && ZNClass._super_ !== ZNObject) {
                    throw new Error('Partial class "' + _name + '" must have consistent super class.');
                }

            } else {
                ZNClass = _meta.abstract ?
                    function () {
                        throw new Error('Cannot instantiate abstract class.');
                    } :
                    function () {
                        var _mixins = ZNClass._mixins_ || [],
                            _ctors = ZNClass._ctors_ || [],
                            _ctor_ = null,
                            _arguments = arguments;

                        this.__id__ = __id__++;
                        this.__handlers__ = {};
                        this.__initializing__ = true;
                        this.__afters__ = [];

                        var _mixin = null,
                            _ctor = null;

                        for (var i = 0, _len = _mixins.length; i < _len; i++) {
                            _mixin = _mixins[i];
                            if(_mixin['@init']){
                                _ctor = _mixin['@init'].meta;
                                _ctor = zn.is(_ctor, 'function') ? _ctor : _ctor.value;
                                __execSuperCtor(_mixin.prototype.__super__, this, _arguments);
                                if (_ctor) {
                                    _ctor.call(this);
                                }
                            }else {
                                __execSuperCtor(_mixin.prototype.__super__, this, _arguments);
                            }
                        }

                        __execSuperCtor(this.__super__, this, _arguments);

                        for (var j = 0, _ctorLen = _ctors.length; j < _ctorLen; j++) {
                            _ctor_ = _ctors[j];
                            _ctor_ = zn.is(_ctor_, 'function') ? _ctor_ : _ctor_.value;
                            if (_ctor_) {
                                _ctor_.apply(this, _arguments);
                            }
                        }

                        while(this.__afters__.length>0){
                            var _after = this.__afters__.pop();
                            _after.handler.apply(_after.context, _arguments);
                        }

                        this.__afters__ = null;
                        delete this.__afters__;


                        this.__initializing__ = false;
                    };

                ZNClass._ctors_ = [];
            }

            if (ZNClass._super_ !== _super) {
                _SuperClass = function () { };
                _SuperClass.prototype = _super.prototype;
                _prototype = new _SuperClass();
                _prototype.constructor = ZNClass;
                _prototype.__type__ = _name || 'Anonymous';
                _prototype.__super__ = _super;


                ZNClass.prototype = _prototype;
            } else {
                _prototype = ZNClass.prototype;
            }

            if (_init) {
                ZNClass._ctors_.push(_init);
                if(!_prototype.__ctor__){
                    _prototype.__ctor__ = _init;
                }
            }

        }

        __class._meta(ZNClass, _args);

        if (_prototype.__define__) {
            _prototype.__define__.call(ZNClass);
        }

        if(_name){
            zn.path(GLOBAL, _name, ZNClass);
        }

        return ZNClass;
    }

    zn.class = define;


})(zn);
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

    var _doc = zn.GLOBAL.document;

    if(!_doc){
        zn.SLASH = SLASH = require('path').sep;
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

    var Module = zn.class('zn.Module', {
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
            loadModule: function (path, callback, parent){
                if (zn.is(path, Module)){
                    return path.load(callback);
                }
                if (path.substring(0, 5) === 'node:') {
                    return callback(require(path.substring(5)));
                }
                var _path = __path.formatPath(path, parent),
                    _module = Module.all[_path];

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
                    _callback = callback || zn.idle;
                _callback(require(_path));
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
            value: null
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

        if (_len === 2) {
            _deps = _arg0;
            _factory = _args[1];
        }
        else if (_len === 1) {
            if (zn.is(_arg0, 'function')) {
                _factory = _arg0;
            }
            else if (zn.is(_arg0, 'array')) {
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
            }
            else {
                _factory = function () {
                    return _arg0;
                };
            }
        }
        else {
            throw new Error('Invalid arguments.');
        }

        if(_deps && zn.is(_deps, 'string')){
            _deps = [_deps];
        }

        return Module.current = new Module('', _deps, _factory), Module.current;
    };

    var Loader = zn.class('zn.Loader', {
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

})(zn);
/**
 * Created by yangyxu on 8/20/14.
 */
(function (zn){

    var __slice = Array.prototype.slice;

    /**
     * String: String
     * @class String
     * @namespace zn.format
     **/
    var StringFormatter = zn.class('zn.format.String', {
        static: true,
        properties: {

        },
        methods: {
            init: function (args){

            },
            formatString: function (){
                var _argv = __slice.call(arguments);

                switch(_argv.length){
                    case 1:
                        return _argv[0];
                    case 2:
                        var _data = {};
                        switch(zn.type(_argv[1])){
                            case 'string':
                                _data[0] = _argv[1];
                                break;
                            case 'array':
                                _data = _argv[1].toJSON();
                                break;
                            case 'object':
                                _data = _argv[1];
                                break;
                        }

                        return this.__formatSql(_argv[0], _data);
                    default:
                        var _sql = _argv.shift();

                        return this.__formatSql(_sql, _argv.toJSON());
                }
            },
            __formatSql: function (sql, data){
                var _reg = null;
                zn.each(data, function (value, index){
                    _reg = new RegExp('\\{'+index+'\\}', 'gi');
                    sql = sql.replace(_reg, value);
                });
                _reg = null;

                return sql;
            }
        }
    });

})(zn);
/**
 * Created by yangyxu on 2014/9/16.
 * Promise: Promise
 */
(function (zn){

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

    var Async = zn.class('zn.util.Async', {
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
            defer: function (resolve, reject) {
                var _self = this, _defer = new Defer(resolve, reject);
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
            init: function (resolve, reject) {
                this._promise = new Promise();
                if(resolve){
                    this.resolve(resolve);
                }
                if(reject){
                    this.reject(reject);
                }
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

    zn.async = Async;

})(zn);
/**
 * Created by yangyxu on 8/20/14.
 */
(function (zn){

    var DATE_FORMAT = {
        ISO8601: "yyyy-MM-dd hh:mm:ss.SSS",
        ISO8601_WITH_TZ_OFFSET: "yyyy-MM-ddThh:mm:ssO",
        DATETIME: "dd MM yyyy hh:mm:ss.SSS",
        ABSOLUTETIME: "hh:mm:ss.SSS"
    };

    /**
     * Date: Date
     * @class Date
     * @namespace zn.util
     **/
    var DateUtil = zn.class('zn.util.DateUtil', {
        static: true,
        properties: {

        },
        methods: {
            init: function (args){

            },
            asString: function (date){
                var format = DATE_FORMAT.ISO8601;
                if (typeof(date) === "string") {
                    format = arguments[0];
                    date = arguments[1];
                }
                var vDay = this.__addZero(date.getDate());
                var vMonth = this.__addZero(date.getMonth()+1);
                var vYearLong = this.__addZero(date.getFullYear());
                var vYearShort = this.__addZero(date.getFullYear().toString().substring(2,4));
                var vYear = (format.indexOf("yyyy") > -1 ? vYearLong : vYearShort);
                var vHour  = this.__addZero(date.getHours());
                var vMinute = this.__addZero(date.getMinutes());
                var vSecond = this.__addZero(date.getSeconds());
                var vMillisecond = this.__padWithZeros(date.getMilliseconds(), 3);
                var vTimeZone = this.__offset(date);
                var formatted = format
                    .replace(/dd/g, vDay)
                    .replace(/MM/g, vMonth)
                    .replace(/y{1,4}/g, vYear)
                    .replace(/hh/g, vHour)
                    .replace(/mm/g, vMinute)
                    .replace(/ss/g, vSecond)
                    .replace(/SSS/g, vMillisecond)
                    .replace(/O/g, vTimeZone);
                return formatted;
            },
            __padWithZeros: function (vNumber, width){
                var numAsString = vNumber + "";
                while (numAsString.length < width) {
                    numAsString = "0" + numAsString;
                }
                return numAsString;
            },
            __addZero: function(vNumber){
                return this.__padWithZeros(vNumber, 2);
            },
            __offset: function (date){
                // Difference to Greenwich time (GMT) in hours
                var os = Math.abs(date.getTimezoneOffset());
                var h = String(Math.floor(os/60));
                var m = String(os%60);
                if (h.length == 1) {
                    h = "0" + h;
                }
                if (m.length == 1) {
                    m = "0" + m;
                }
                return date.getTimezoneOffset() < 0 ? "+"+h+m : "-"+h+m;
            }
        }
    });

    var TYPES = ['INFO', 'DEBUG', 'WARNING', 'ERROR', 'TRACE', '', 'INIT'];
    var COLORS_VALUE = ['#100000', '#2125a0', '#a82c2c', '#c045b7', '1cb131', '', '#100000'];
    var COLORS = [38, 34, 35, 31, 32, 36, 33];
    var LEVELS = {
        INFO: 0,
        DEBUG: 1,
        WARNING: 2,
        ERROR: 3,
        TRACE: 4,
        INIT: 6
    };

    /**
     * Logger: Logger
     * @class Logger
     * @namespace zn.util
     **/
    var Logger = zn.class('Logger', {
        static: true,
        properties: {

        },
        methods: {
            init: function (args){

            },
            info: function (obj) {
                this.__log(LEVELS.INFO, obj);
            },
            debug: function (obj) {
                this.__log(LEVELS.DEBUG, obj);
            },
            warn: function (obj) {
                this.__log(LEVELS.WARNING, obj);
            },
            trace: function (obj) {
                this.__log(LEVELS.TRACE, obj);
            },
            error: function (obj) {
                this.__log(LEVELS.ERROR, obj);
            },
            __getDateString: function (date) {
                return DateUtil.asString(date||new Date());
            },
            __getPosition: function (){
                try {
                    throw new Error();
                } catch(e) {
                    var _pos = e.stack.split('\n')[4].replace(/\(/g, '').replace(/\)/g, '').split('/').pop();
                    return _pos;
                }
            },
            __formatLog4Server: function (log, color) {
                var _tag = '', _head = '', _foot = '';
                if (color) {
                    _head = '\x1B[';
                    _foot = '\x1B[0m';
                    _tag = COLORS[5]+'m';
                    color = COLORS[log.type]+'m';
                }
                return [
                    log.time,
                    ' [',
                    _head,
                    color,
                    TYPES[log.type],
                    _foot,
                    '] [',
                    _head,
                    _tag,
                    log.pos,
                    _foot,
                    '] ',
                    log.message
                ].join('');
            },
            __formatLog4Client: function (log, color) {
                return [
                    '%c'+log.time,
                    ' [',
                    TYPES[log.type],
                    '] [',
                    log.pos,
                    '] ',
                    log.message
                ].join('');
            },
            __log: function (type, message) {
                var _log = {
                    type: type,
                    message: typeof message=='object'?JSON.stringify(message): message,
                    time: this.__getDateString(),
                    pos: this.__getPosition()
                };
                if (!zn.GLOBAL.document){
                    console.log(this.__formatLog4Server(_log, true));
                }else {
                    console.log(this.__formatLog4Client(_log, true), 'color:'+COLORS_VALUE[type]);
                }
            }
        }
    });

    var __console = {
        info: function (){
            Logger.info.apply(Logger, arguments);
        },
        debug: function (){
            Logger.debug.apply(Logger, arguments);
        },
        warn: function (){
            Logger.warn.apply(Logger, arguments);
        },
        trace: function (){
            Logger.trace.apply(Logger, arguments);
        },
        error: function (){
            Logger.error.apply(Logger, arguments);
        },
    };

    zn.extend(zn, __console);

})(zn);
(function (zn){

    /**
     * @class TestCase
     * @namespace zn.unit
     * @type {Function}
     */
    var TestCase = zn.class('zn.unit.TestCase',{
        properties: {

        },
        methods: {
            init: function () {

            }
        }
    });

})(zn);
(function (zn){

    var TestLoader = zn.class('zn.unit.TestLoader',{
        static: true,
        properties: {
            basePath: ''
        },
        methods: {
            init: function (){
                this._casePaths = [];
                this._caseMethods = [];
            },
            load: function (path){
                if(Array.isArray(path)){
                    this._casePaths.concat(path);
                }else {
                    this._casePaths.push(path);
                }

                return this;
            },
            run: function () {
                this.__testingCase();
            },
            __testingCase: function (){
                var _case = this._casePaths.shift(),
                    _basePath = this.basePath,
                    _path = _basePath + _case;
                    _self = this;

                if(_case){
                    zn.load(_path, function (testCaseClass){
                        var _methods = testCaseClass.getMeta('methods')||[];
                        zn.info('Testing Case: '+ _case);
                        _self.__testingCaseMethods(_methods);
                    });
                }
            },
            __testingCaseMethods: function (methods){
                this._caseMethods = [];
                for(var name in methods){
                    var _method = methods[name];
                    _method.key = name;
                    this._caseMethods.push(_method);
                }
                this.__testingCaseMethod();
            },
            __testingCaseMethod: function (){
                var _method = this._caseMethods.shift(), _self = this;
                if(_method){
                    var _beginTime = (new Date()).getTime(), _methodname = _method.key;
                    var _promise = _method.call(null);
                    if(_promise&&_promise.then){
                        _promise.then(function (){
                            _self.__getDiffSecond(_beginTime, _methodname);
                            _self.__testingCaseMethod();
                        });
                    }else{
                        _self.__getDiffSecond(_beginTime, _methodname);
                        _self.__testingCaseMethod();
                    }
                }else {
                    _self.__testingCase();
                }
            },
            __getDiffSecond: function (beginTime, methodname){
                var _endTime = (new Date()).getTime();
                var _diff = _endTime - beginTime;
                var days=Math.floor(_diff/(24*3600*1000));
                var leave1=_diff%(24*3600*1000);
                var hours=Math.floor(leave1/(3600*1000));
                var leave2=leave1%(3600*1000);
                var minutes=Math.floor(leave2/(60*1000));
                var leave3=leave2%(60*1000);
                var seconds=Math.round(leave3/1000);
                zn.info('Test method '+methodname+' :{ second: '+seconds+'s, diff: '+_diff+' }');
            }
        }
    });

})(zn);
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

    var List = zn.class('zn.data.List', {
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

    zn.class('zn.data.TList', {
        statics: {
            getInstance: function (args){
                return new this(args);
            }
        },
        properties: {
            min: 0,
            max: 100,
            T: null,
            TArgs: {}
        },
        methods: {
            init: function (inArgs) {
                this.sets(inArgs);
                this.reset();
            },
            reset: function (){
                this._data = [];
                for(var i= 0; i < (this.min||0); i++){
                    this.push(this.TArgs);
                }
            },
            push: function (tArgs){
                if(this.T){
                    var _t = new this.T(tArgs||this.TArgs);
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

    zn.class('zn.data.Task', {
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

    var Observable = zn.class('zn.data.Observable', {
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

    var Binding = zn.class({
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
    var Bindable = zn.class('zn.data.Bindable', zn.data.Observable, {
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

    var Map = zn.class('zn.data.Map', {
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

    zn.class('zn.data.ObservableList', zn.data.List, {
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

    zn.class('zn.data.ObservableMap', zn.data.Map, {
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