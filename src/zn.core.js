/**
 * Global Var
 */

var __isServer = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
var zn = {
    VERSION: '0.0.1',
    DEBUG: false,
    ZN_PATH: '',
    PATH: '',
    isServer: __isServer,
    GLOBAL: (function () {
        if(__isServer){
            return global;
        }else {
            return window;
        }
    }).call(null)
};

zn.GLOBAL.zn = zn;

if (__isServer) {
    zn.ZN_PATH = __dirname;
    zn.PATH = process.cwd();
    module.exports = zn;
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
        format: function (){
            var _argv = arguments,
                _value = null,
                _values = null;
            if(_argv.length<2){
                return _argv[0];
            }else {
                _value = _argv[0].toString();
                _values = _argv[1];
                __builtinZNObject__.each(_values, function (value, index){
                    value = (__builtinZNObject__.is(value, 'object')?JSON.stringify(value):value.toString());
                    _value = _value.replace(new RegExp('\\{'+index+'\\}', 'gi'), value);
                });
            }

            return _value;
        },
        uuid: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            }).toUpperCase();
        },
        serializeJSON: function (data){
            return Object.keys(data).map(function (key) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
            }).join('&');
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
        },
        deepEachObject: function (data, handler, context){
            if(__builtinZNObject__.is(data, 'object')){
                var _value = null,
                    _result;
            	for(var key in data){
            		_value = data[key];
                    if(__builtinZNObject__.is(_value, 'object')){
                        this.deepEachObject(_value, handler, context);
                    }else {
                        _result = handler && handler.call(context, _value, key, data);
                        if(_result!==undefined&&_result!==null){
                            data[key] = _result;
                        }
                    }
            	}
            }

        	return data;
        },
        arrayValueToObject: function (data, handler, context){
            if(__builtinZNObject__.is(data, 'array')){
                var _value = null,
                    _data = {},
                    _result;
                for(var i = 0, _len = data.length; i < _len; i++){
                    _value = data[i];
                    _result = handler && handler.call(context, _value, i, data);
                    if(_result!==undefined&&_result!==null){
                        _data[_value] = _result;
                    }
                }
                data = _data;
            }

        	return data;
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

    var __fixStringPrototype__ = {
        format: function (){
            var _argv = arguments, _self = this;
            if(_argv.length == 1 && typeof _argv[0] == 'object'){
                _argv = _argv[0];
            }
            zn.each(_argv, function (value, index){
                value = (zn.type(value)=='object'?JSON.stringify(value):value.toString());
                _self = _self.replace(new RegExp('\\{'+index+'\\}', 'gi'), value);
            });

            return _self.toString();
        }
    };

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
        /*
        toJSON: function (){
            var _data = {};
            for(var i= 0, _len = this.length; i < _len; i++){
                _data[i] = this[i];
            }

            return _data;
        },*/
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
    //zn.fix(zn.GLOBAL.JSON, __fixJSON__);
    zn.fix(String.prototype, __fixStringPrototype__);

    /*
    try {
        Object.defineProperty({}, 'zn', {});
    }
    catch (ex) {
        Object.defineProperty = function (obj, property, descriptor) {
            return __fixObject__.defineProperty(obj, property, descriptor);
        };
    }*/

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
        sets: function (values, options, callback) {
            if (values) {
                var _value = null;
                for (var _name in values) {
                    if (values.hasOwnProperty(_name)) {
                        _value = values[_name];
                        if((callback && callback(_value, _name, options))!==false){
                            this.set(_name, _value, options);
                        }
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
        getProperties: function(callback){
            var _props = {};
            if(!this.getMeta || this._name_ == 'ZNObject'){
                return _props;
            }

            var _super = this._super_,
                _mixins = this._mixins_;

            if(_super){
                zn.extend(_props, _super.getProperties(callback));
            }

            if(_mixins && _mixins.length){
                zn.each(_mixins, function (mixin){
                    zn.extend(_props, mixin.getProperties(callback));
                });
            }

            zn.each(this.getMeta('properties'), function (prop, index){
                var _callback = callback && callback(index, prop)===false;
                if(!_callback){
                    if(!prop.hidden){
                        _props[index] = prop;
                    }
                }
            });

            return _props;
        },
        getPropertie: function (name){
            var _prop = null;
            if(name){
                zn.each(this.getProperties(), function (field, key){
                    if(name == key){
                        _prop = field;
                    }
                    return -1;
                });
            }

            return _prop;
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
            var _info = {
                ClassName: (this.__name__ || 'Anonymous'),
                InstanceID: this.__id__,
                Meta: this.constructor._meta_
            };
            return JSON.stringify(_info);
        },
        /**
         * Instance Object to json value.
         * @returns {json}
         */
        toJson: function (){
            var _json = {};
            zn.each(this.constructor.getProperties(), function (field, key){
                _json[key] = this.get(key);
            }, this);

            return _json;
        },
        getProperties: function (){
            return this.constructor.getProperties();
        },
        getPropertie: function (name){
            return this.constructor.getPropertie(name);
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
        offs: function (names) {
            var _names = Array.prototype.slice.call(arguments);
            if(_names.length){
                zn.each(_names, function (name){
                    if(this.__handlers__[name]){
                        this.__handlers__[name] = [
                            {
                                owner: null,
                                handler: null,
                                context: null
                            }
                        ];
                    }
                }.bind(this));
            }else {
                this.__handlers__ = {};
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
            var _listeners = this.__handlers__[name],
                _listener,
                _result = null;
            if (_listeners) {
                for (var i = 0, length = _listeners.length; i < length; i++) {
                    _listener = _listeners[i];
                    if (_listener && _listener.handler) {
                        if(options && options.method=='apply'){
                            _result = _listener.handler.apply(_listener.context || _listener.owner, data);
                        } else {
                            _result = _listener.handler.call(_listener.context || _listener.owner, _listener.owner, data, options);
                        }
                        if (false === _result) {
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

    zn.isZNObject = function (value) {
        return value instanceof ZNObject;
    };

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

                zn.each(_meta.properties || _meta.props, function (value, key) {
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
            //TODO: This will not working in es5.
            //return arguments.callee(__super__._super_, __context__);
        }
    };

    /**s
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

            _prototype.class = _prototype.constructor;

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

    zn.Class = define;

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
                    zn.error(e.message);
                }

                return this;
            },
            loadModule: function (path, callback, parent){
                if (zn.is(path, Module)){
                    return path.load(callback);
                }
                if (path.substring(0, 5) === 'node:') {
                    return callback(require(path.substring(5)));
                }

                var _path = __path.formatPath(path, parent);
                if(!_doc) {
                    try {
                        _path = require.resolve(_path);
                    } catch (e) {
                        zn.error('node require.resolve() error: ', e.message);
                        return callback({});
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
                    zn.error('node require() error: ', e.message);
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

/**
 * Created by yangyxu on 2016/4/5.
 * Queue: Queue
 */
(function (zn){

    var __slice = Array.prototype.slice;

    //__slice.call(arguments);

    var TASK_STATE = {
        PENDING: 0,
        CANCLE: 1,
        PAUSE: 2,
        FINISHED: 3
    };

    /**
     * TaskProcessor: TaskProcessor
     * @class TaskProcessor
     **/
    var TaskProcessor = zn.Class({
        events: ['init', 'finished'],
        properties: {
            status: {
                value: TASK_STATE.PENDING,
                get: function (){
                    return this._status;
                }
            }
        },
        methods: {
            init: function (inArgs) {

            },
            doTask: function (task, argv){
                if(task){
                    var _argv = argv||[];
                    _argv.unshift(this);
                    task.handler.apply(task.context, _argv);
                }
            },
            done: function (){
                this._status = TASK_STATE.FINISHED;
                this._data = __slice.call(arguments);
                this.fire('finished', this._data);
                this.off('finished');
            }
        }
    });

    /**
     * Queue: Queue
     * @class Queue
     **/
    var Queue = zn.Class({
        events: [
            'clear',
            'push',
            'pause',
            'resume',
            'exception',
            'every',
            'finally'
        ],
        properties: {
            count: {
                get: function (){
                    return this._tasks.length;
                }
            }
        },
        methods: {
            init: function (inArgs) {
                this._exceptions = [];
                this._finallys = [];
                this._everys = [];
                this._tasks = [];
                this._taskProcessor = [];
                this._lastTask = null;
                this._data = [];
                this._max = (inArgs||{}).max || 1;
            },
            destroy: function (){
                this._everys = [];
                this._tasks = [];
                this._taskProcessor = [];
                this.fire('finally', this._data, { method: 'apply' });
                this.super();
            },
            clear: function (){
                this._tasks = [];
            },
            pause: function (maxWaitTime){
                this._paused = true;
        		if(maxWaitTime > 0) {
        			this._pauseTimer = setTimeout(function() {
        				this.resume();
        			}.bind(this), maxWaitTime);
        		}
                this.fire('pause');
                return this;
            },
            resume: function (){
                if(this._pauseTimer){
                    clearTimeout(this._pauseTimer);
                }
                this._paused = false;
                this.fire('resume');
                this.doTask();

                return this;
            },
            exception: function (handler, context){
                return this.on('exception', handler, context || this), this;
            },
            catch: function (exception){
                return this.fire('exception', exception), this;
            },
            finally: function (handler, context){
                return this.on('finally', handler, context || this), this;
            },
            every: function (handler, context){
                return this.on('every', handler, context || this), this;
            },
            push: function (handler, context){
                var _task = {
                    handler: handler,
                    context: context || this
                };

                if(this._lastTask){
                    _task.previous = _task;
                    this._lastTask.next = _task;
                }

                this._lastTask = _task;
                this._tasks.push(_task);
                this.fire('push', _task);
                return this;
            },
            getTaskProcessor: function (){
                var _tp = null, _len = this._taskProcessor.length;
                for (var i = 0; i < _len; i++) {
                    _tp = this._taskProcessor[i];
                    if(_tp.status == TASK_STATE.FINISHED){
                        return _tp;
                    }
                }
                if(!_tp&&this._max > _len){
                    var _processor = new TaskProcessor();
                    _processor.queue = this;
                    _processor.on('finished', this.__onProcessorFinished.bind(this), this);
                    return _processor;
                }
            },
            start: function (){
                this._data = [];
                return this.doTask();
            },
            doTask: function (data){
                var _task = this._tasks.shift();
                if(_task){
                    var _taskProcessor = this.getTaskProcessor();
                    if(_taskProcessor){
                        _task.previousResult = data;
                        _taskProcessor.doTask(_task, data);
                    }
                }else {
                    this.destroy();
                }

                return this;
            },
            __onProcessorFinished: function (sender, data){
                this._data.push(data);
                this.fire('every', data, { method: 'apply' });
                this.doTask(data);
            }
        }
    });

    zn.queue = function(argv){
        return new Queue(argv);
    };

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
    var DateUtil = zn.Class('zn.util.DateUtil', {
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
    var Logger = zn.Class({
        static: true,
        methods: {
            info: function () {
                this.__log.call(this, LEVELS.INFO, arguments);
            },
            debug: function () {
                this.__log.call(this, LEVELS.DEBUG, arguments);
            },
            warn: function () {
                this.__log.call(this, LEVELS.WARNING, arguments);
            },
            trace: function () {
                this.__log.call(this, LEVELS.TRACE, arguments);
            },
            error: function (obj) {
                this.__log.call(this, LEVELS.ERROR, arguments);
            },
            __getDateString: function (date) {
                return DateUtil.asString(date||new Date());
            },
            __getPosition: function (){
                try {
                    throw new Error();
                } catch(e) {
                    //console.log(e.stack);
                    var _pos = e.stack.split('\n')[5].replace(/\(/g, '').replace(/\)/g, '').split('/').pop();
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

                /*
                return [
                    log.time,
                    ' [',
                    _head,
                    color,
                    TYPES[log.type],
                    _foot,
                    '] '
                ].join('');*/


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
                    //'] [', //'] [',
                    //log.pos,
                    '] '
                ].join('');
            },
            __log: function (type, argv) {
                var _argv = Array.prototype.slice.call(argv);
                if (typeof module !== 'undefined' && module.exports){
                    _argv.unshift(this.__formatLog4Server({
                        type: type,
                        time: this.__getDateString(),
                        pos: this.__getPosition()
                    }, true));
                }else {
                    _argv.unshift(this.__formatLog4Client({
                        type: type,
                        time: this.__getDateString(),
                        pos: this.__getPosition()
                    }, true));

                    _argv.unshift('color:'+COLORS_VALUE[type]);
                }

                console.log.apply(this, _argv);
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

    var Async = zn.Class({
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

    zn.async = Async;

})(zn);

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
                    _XHR.withCredentials = true;
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

    var HttpClient = zn.Class({
        properties: {
            timeout: 1000
        },
        methods: {
            init: function(config){
                this.sets(config);
            },
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

    var _http = new HttpClient();

    zn.extend(zn, {
        $get: _http.get.bind(_http),
        $post: _http.post.bind(_http),
        $put: _http.put.bind(_http),
        $delete: _http.delete.bind(_http)
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

                return zn['$' + _argv.method.toLowerCase()]({
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
            host: 'http://0.0.0.0:8080/',
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

    zn.GLOBAL.Store = new StoreClass();
})(zn);
