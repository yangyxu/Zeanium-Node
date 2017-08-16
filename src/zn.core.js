/**
 * Global Var
 */

var __isServer = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
var zn = {
    VERSION: '0.0.1',
    DEBUG: true,
    ZN_PATH: '',
    PATH: '',
    GLOBAL: (function () {
        if(__isServer){
            return global;
        }else {
            return window;
        }
    }).call(null),
    isServer: __isServer,
    plugin: {}
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
        isNull: function (value){
            return value === null || value === undefined;
        },
        isNotNull: function (value){
            return value !== null && value !== undefined;
        },
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
                _value = _argv[0];
                _value = _value.toString?_value.toString():_value;
                _values = _argv[1];
                __builtinZNObject__.each(_values, function (value, index){
                    if(value!==null&&value!==undefined){
                        value = (__builtinZNObject__.is(value, 'object')?JSON.stringify(value):(value.toString?value.toString():value));
                        _value = _value.replace(new RegExp('\\{'+index+'\\}', 'gi'), value);
                    }
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
                if(value!==null&&value!==undefined){
                    value = (zn.type(value)=='object'?JSON.stringify(value):(value.toString?value.toString():value));
                    _self = _self.replace(new RegExp('\\{'+index+'\\}', 'gi'), value);
                }
            });

            //return zn.format.call(this, this, arguments);

            return _self.toString();
        },
        firstUpperCase: function (value){
            return value.replace(/\b(\w)(\w*)/g, function($0, $1, $2) {
                return $1.toUpperCase() + $2;
            });
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

    /**
     * Number.prototype.format(n, x)
     *
     * @param integer n: length of decimal
     * @param integer x: length of sections
     */
    var __fixNumber__ = {
        format: function (n, x){
            var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
            return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
        },
        sectionThree: function (){
            return (this).toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        },
        price: function (options){
    		var _options = zn.extend({
    			unit: 10000,
    			unitText: '万',
    			prefix: '',
                decimal: 2,
                sections: 3
    		}, options);
    		if(((this/_options.unit) > 1)&&(this%100 == 0)){
                return (this/_options.unit).sectionThree() + _options.unitText;
    		}else {
    			return this.format(_options.decimal, _options.sections);
    		}
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
    zn.fix(Number.prototype, __fixNumber__);

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
                if(!meta.value){
                    meta.value = function (){

                    };
                }

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
        createSelf: function (){
            return new this.constructor.apply(this, Array.prototype.slice.call(arguments));
        },
        getProperties: function(handler, context){
            var _props = {};
            if(!this.getMeta || this._name_ == 'ZNObject'){
                return _props;
            }

            var _super = this._super_,
                _mixins = this._mixins_;

            if(_super){
                zn.extend(_props, _super.getProperties(handler, context));
            }

            if(_mixins && _mixins.length){
                zn.each(_mixins, function (mixin){
                    zn.extend(_props, mixin.getProperties(handler, context));
                });
            }

            zn.each(this.getMeta('properties'), function (prop, name){
                var _callback = handler && handler.call(context || this, prop, name, _props);
                if(_callback === false || _callback === -1){
                    return _callback;
                }

                if(!prop.hidden){
                    _props[name] = prop;
                }
            }, this);

            return _props;
        },
        getProperty: function (name){
            var _prop = null;
            if(name){
                this.getProperties(function (prop, key){
                    if(name == key){
                        _prop = field;
                    }
                    return -1;
                });
            }

            return _prop;
        },
        existProperty: function (name){
            return !!this.getProperty(name);
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
            if(name && value){
                this._meta_[name] = value;
            }

            return this;
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
            return this.constructor.getProperties.apply(this, arguments);
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
                        //TODO: This will not working in es6.
                        __execSuperCtor(mixin.prototype.__super__, mixin.prototype, __arguments__);
                        if (_mixinCtor) {
                            _mixinCtor.call(__context__);
                        }
                    }
                });
            }

            if(_superCtor && _superCtor.meta.auto){
                _superCtor.meta.value.apply(__context__, __arguments__);
            }
            //TODO: This will not working in es6.
            return arguments.callee(__super__._super_, __context__);
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

        _meta.properties = _meta.properties || _meta.props;
        _meta.props = null;
        delete _meta.props;

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
                    delete require.cache[path];
                    module = null;

                    var _module = Module.all[path];
                    if(_module&&_module.parent){
                        Module.unloadModule(_module.parent.path);
                    }

                    Module.all[path] = null;
                    delete Module.all[path];
                    _module = null;
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

/**
 * Created by yangyxu on 5/20/17.
 */
(function (zn){

    var CHAR_CODE = {
        lower: [97, 123],
        upper: [65, 91]
    };

    zn.char = zn.Class({
        static: true,
        methods: {
            lowercase: function (value){
                return zn.is(value, 'string') ? value.replace(/[A-Z]/g, function(char) {
                    return String.fromCharCode(char.charCodeAt(0) | 32);
                }) : value;
            },
            uppercase: function (value){
                return zn.is(value, 'string') ? value.replace(/[a-z]/g, function(char) {
                    return String.fromCharCode(char.charCodeAt(0) & ~32);
                }) : value;
            },
            toUnicode: function (value){
                var _codes = [];
                for(var i = 0, _len = value.length; i < _len; i++){
                    _codes.push(value.charCodeAt(i));
                }

                return _codes;
            },
            toChar: function (start, end){
                var _chars = [];
                for(var i = start; i < end; i++){
                    _chars.push(String.fromCharCode(i));
                }

                return _chars;
            },
            getLowercaseLetters: function (){
                var _index = CHAR_CODE.lower;
                return this.toChar(_index[0], _index[1]);
            },
            getUppercaseLetters: function (){
                var _index = CHAR_CODE.upper;
                return this.toChar(_index[0], _index[1]);
            },
            getStringFromChar: function (char, length){
                var _char = char || 'A',
                    _len = length || 26,
                    _chars = [];
                for(var i = 0; i < _len; i++){
                    _chars.push(String.fromCharCode(_char.charCodeAt(0) + i));
                }

                return _chars.join('');
            }
        }
    });

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
    zn.date = zn.Class({
        static: true,
        methods: {
            getSecond: function (value) {
                var _value = value.substring(1,value.length)*1;
                switch (value.substring(0,1)) {
                    case 's':
                        return _value * 1000;
                    case 'h':
                        return _value * 60 * 60 * 1000;
                    case 'd':
                        return _value * 24 * 60 * 60 * 1000;
                }
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
            'insert',
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
            unshift: function (handler, context){
                return this.insert(handler, context, 0), this;
            },
            push: function (handler, context){
                return this.insert(handler, context, -1), this;
            },
            inserts: function (handlers, context, index){
                var _tasks = handlers||[],
                    _index = index || 0,
                    _first = this._tasks[0],
                    _last = null,
                    _task = null;
                _tasks = _tasks.map(function (handler){
                    _task = {
                        handler: handler,
                        context: context || this
                    };

                    if(_last){
                        _task.previous = _last;
                        _last.next = _task;
                    }
                    _last = _task;

                    return _task;
                }.bind(this));

                if(_first){
                    _last.next = _first;
                    _first.previous = _last;
                }

                _tasks.unshift(0);
                _tasks.unshift(_index);

                return this._tasks.splice.apply(this._tasks, _tasks), this;
            },
            insert: function (handler, context, index){
                var _task = {
                    handler: handler,
                    context: context || this
                }, _index = index || -1;

                switch (_index) {
                    case -1:
                        if(this._lastTask){
                            _task.previous = _task;
                            this._lastTask.next = _task;
                        }

                        this._lastTask = _task;
                        this._tasks.push(_task);
                        break;
                    case 0:
                        var _first = this._tasks[0];

                        if(_first){
                            _task.next = _first;
                            _first.previous = _task;
                        }

                        this._tasks.unshift(_task);
                        break;
                    default :
                        this._tasks.splice(_index, 0, _task);
                        break;
                }

                return this.fire('insert', _task), this;
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

    var TYPES = ['INFO', 'DEBUG', 'WARN', 'ERROR', 'TRACE', 'ALL'];
    var COLORS_VALUE = ['#100000', '#2125a0', '#a82c2c', '#c045b7', '1cb131', '#100000'];
    var COLORS = [38, 34, 35, 31, 32, 36, 33];
    var LEVELS = {
        INFO: 0,
        DEBUG: 1,
        WARN: 2,
        ERROR: 3,
        TRACE: 4,
        ALL: 6
    };

    /**
     * Logger: Logger
     * @class Logger
     * @namespace zn.util
     **/
    var Logger = zn.Class({
        events: [
            'info',
            'debug',
            'warn',
            'error',
            'trace',
            'all'
        ],
        methods: {
            init: function (){
                this._config = {
                    only: null,
                    levels: ['info', 'debug', 'warn', 'error', 'trace', 'all']
                };
            },
            config: function (value){
                this._config = zn.overwrite(value, this._config);
            },
            info: function () {
                this.__log.call(this, LEVELS.INFO, arguments);
            },
            debug: function () {
                this.__log.call(this, LEVELS.DEBUG, arguments);
            },
            warn: function () {
                this.__log.call(this, LEVELS.WARN, arguments);
            },
            trace: function () {
                this.__log.call(this, LEVELS.TRACE, arguments);
            },
            error: function (obj) {
                this.__log.call(this, LEVELS.ERROR, arguments);
            },
            all: function (obj) {
                this.__log.call(this, LEVELS.ALL, arguments);
            },
            __getDateString: function (date) {
                return zn.date.asString(date||new Date());
            },
            __getPosition: function (){
                try {
                    throw new Error();
                } catch(e) {
                    if(zn.DEBUG && zn.CONSOLE_ERROR){
                        console.log(e.stack);
                    }

                    return e.stack.split('\n')[5].replace(/\(/g, '').replace(/\)/g, '').split('/').pop();
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
                    //'] [', //'] [',
                    //log.pos,
                    '] '
                ].join('');
            },
            __log: function (type, argv) {
                var _argv = Array.prototype.slice.call(argv),
                    _data = _argv.slice(0),
                    _type = TYPES[type].toLowerCase(),
                    _time = this.__getDateString(),
                    _pos = this.__getPosition();

                _data.unshift(_pos);
                _data.unshift(_type);
                _data.unshift(_time);
                if (typeof module !== 'undefined' && module.exports){
                    _argv.unshift(this.__formatLog4Server({
                        type: type,
                        time: _time,
                        pos: _pos
                    }, true));
                }else {
                    _argv.unshift('color:' + COLORS_VALUE[type]);
                    _argv.unshift(this.__formatLog4Client({
                        type: type,
                        time: _time,
                        pos: _pos
                    }, true));
                }

                if(this.__isOk(_type)){
                    var _result = this.fire(_type, _data);
                    if(_result !== false && zn.DEBUG){
                        console.log.apply(this, _argv);
                    }
                }
            },
            __isOk: function (type){
                if(this._config.only){
                    if(this._config.only === type){
                        return true;
                    }
                }else {
                    var _include = (this._config.levels.indexOf(type) !== -1 );
                    if(_include){
                        return true;
                    }
                }

                return false;
            }
        }
    });

    zn.logger = new Logger();

    var __console = {
        info: function (){
            zn.logger.info.apply(zn.logger, arguments);
        },
        debug: function (){
            zn.logger.debug.apply(zn.logger, arguments);
        },
        warn: function (){
            zn.logger.warn.apply(zn.logger, arguments);
        },
        trace: function (){
            zn.logger.trace.apply(zn.logger, arguments);
        },
        error: function (){
            zn.logger.error.apply(zn.logger, arguments);
        }
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

(function (nx) {

    /**
     * querystring: querystring
     * @class querystring
     * @namespace zn.util
     */
    zn.querystring = zn.Class({
        static: true,
        properties: {
            config: {
                get: function (){

                }
            }
        },
        methods: {
            init: function (){
                this._config = {
                    separator: '&',
                    equal: '=',
                    minIndex: 0,
                    maxIndex: 1000
                };
            },
            config: function (value){
                return this.overwrite(this._config, value), this;
            },
            parse: function (value, options){
                if(typeof value == 'object'){
                    return value;
                }

                var _config = zn.extend({}, this._config, options),
                    _object = {},
                    _equal = _config.equal,
                    _qsAry = value.split(_config.separator),
                    _qsLen = _qsAry.length;

                if(_config.maxIndex > 0 && _qsLen > _config.maxIndex){
                    _qsLen = _config.maxIndex;
                }

                for(var i = _config.minIndex; i < _qsLen; i++){
                    var _item = _qsAry[i].replace(/\+/g, '%20'),
                        _firstEqualIndex = _item.indexOf(_equal),
                        _key = null,
                        _value = null;

                    if(_firstEqualIndex >= 0){
                        _key = _item.substr(0, _firstEqualIndex);
                        _value = _item.substr(_firstEqualIndex + 1);
                    } else {
                        _key = _item;
                        _value = '';
                    }
                    _key = decodeURIComponent(_key);
                    _value = decodeURIComponent(_value);

                    if(!(_object).hasOwnProperty(_key)){
                        _object[_key] = _value;
                    }else if(zn.is(_object[_key], 'array')){
                        _object[_key].push(_value);
                    }else {
                        _object[_key] = [_object[_key], _value];
                    }
                }

                return _object;
            },
            stringify: function (object, options){
                if(typeof object == 'string'){
                    return object;
                }
                var _config = zn.extend({}, this._config, options),
                    _strings = [],
                    _self = this,
                    _equal = _config.equal,
                    _object = {};
                if(zn.isZNObject(object)){
                    _object = object.gets();
                }else {
                    _object = object;
                }
                if(zn.is(_object, 'object')){
                    for(var key in object){
                        var _value = object[key],
                            _key = encodeURIComponent(this.__stringifyValue(key));

                        _value = encodeURIComponent(this.__stringifyValue(_value));
                        _strings.push(_key + _equal + _value);
                    }
                }else {
                    throw new Error('Agrument Error.');
                }

                return _strings.join(_config.separator);
            },
            __stringifyValue: function (value){
                switch (zn.type(value)) {
                    case 'string':
                        return value;
                    case 'boolean':
                        return value ? 'true' : 'false';
                    case 'object':
                    case 'array':
                        return JSON.stringify(value);
                    case 'number':
                        return isFinite(value) ? value : '0';
                    default:
                        return '';
                }
            }
        }
    });

})(zn);

/**
 * Created by yangyxu on 5/20/17.
 */
(function (zn){

    zn.data = zn.Class({
        static: true,
        methods: {
            arrayToTree: function (data, options){
                var _pids = {},
                    _ids = {},
                    _root = [],
                    _item = null,
                    _key = null,
                    _options = zn.extend({ id: 'id', pid: 'pid' }, options),
                    _id = _options.id,
                    _pid = _options.pid;

                for(_key in data){
                    _item = data[_key];
                    if(!_pids[_item[_pid]]){
                        _pids[_item[_pid]] = [];
                    }
                    _pids[_item[_pid]].push(_item);
                    _ids[_item[_id]] = _item;
                }

                for(_key in data){
                    if(_pids[data[_key][_id]]){
                        data[_key].children = _pids[data[_key][_id]];
                    }
                }

                for(var pid in _pids){
                    if(!_ids[pid]){
                        _root = _pids[pid];
                        break;
                    }
                }

                return _root;
            }
        }
    });

})(zn);
