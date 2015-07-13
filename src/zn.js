/**
 * Global Var
 */
var zn = {
    VERSION: '0.0.1',
    DEBUG: false,
    GLOBAL: (function () { return this; }).call(null)
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = zn;
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
                var _value = meta.value;
                var _field = '_' + name;
                _getter = function () {
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
                    function (value) {
                        this[_field] = value;
                    };
            } else {
                _getter = meta.get || function () {
                    return undefined;
                };
                _setter = meta.set || function () {
                    return false;
                };
            }

            if (_exist) {
                _getter.__super__ = target[_key].getter;
                _setter.__super__ = target[_key].setter;
            }

            if(!_exist){
                _descriptor = Object.defineProperty(target, name, {
                    get: _getter,
                    set: _setter,
                    configurable: true
                });
            }

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
                } else if (zn.is(arg0, 'function')) {
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
            _meta = _args.meta;
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

                if (ZNClass._super_ !== _super && Class._super_ !== ZNObject) {
                    throw new Error('Partial class "' + _name + '" must have consistent super class.');
                }

            } else {
                ZNClass = _meta.abstract ?
                    function () {
                        throw new Error('Cannot instantiate abstract class.');
                    } :
                    function () {

                        var _mixins = ZNClass._mixins_||[];
                        this.__id__ = __id__++;
                        this.__handlers__ = {};
                        this.__initializing__ = true;


                        for (var i = 0, _len = _mixins.length; i < _len; i++) {
                            var _ctor = _mixins[i].prototype.__ctor__;
                            if (_ctor) {
                                _ctor.call(this);
                            }
                        }

                        if (this.__ctor__) {
                            this.__ctor__.apply(this, arguments);
                        }

                        this.__initializing__ = false;
                    };
            }

            if (ZNClass._super_ !== _super) {
                _SuperClass = function () { };
                _SuperClass.prototype = _super.prototype;
                _prototype = new _SuperClass();
                _prototype.constructor = ZNClass;
                _prototype.__type__ = _name || 'Anonymous';

                ZNClass.prototype = _prototype;
            } else {
                _prototype = ZNClass.prototype;
            }

            if (_meta.methods.init) {
                _prototype.__ctor__ = _meta.methods.init;
            }

        }

        __class._meta(ZNClass, _args);
        //console.log(_prototype.__define__);
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
 * require method
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

    var __path = {
        normalizePath: function (path){
            var _paths = path.split(SLASH);
            var _values = [_paths[0]], _path;

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
        formatCurrentPath: function (currPath, parent){
            var _currPath = currPath,
                _parentPath = parent ? (parent.get('path')||''): zn.PATH,
                _slashIndex = _currPath.indexOf(SLASH);
            if (_slashIndex > 0) {
                _currPath = _parentPath ? (_parentPath.substring(0, _parentPath.lastIndexOf(SLASH) + 1) + _currPath) : _currPath;
                _currPath = this.normalizePath(_currPath);
            }
            else if (_slashIndex === 0) {
                _currPath = this.normalizePath(zn.PATH ? (zn.PATH.substring(0, zn.PATH.lastIndexOf(SLASH)) + _currPath) : _currPath);
            }
            else {
                if (_doc) {
                    var _znPath = zn.ZN_JS_PATH;
                    if(!_znPath){
                        var _src = '';
                        if (!_doc.getElementById('zn-js')) {
                            zn.each(_doc.getElementsByTagName('script'), function (node) {
                                if(node.getAttribute){
                                    _src = node.getAttribute('src') || '';
                                    if (_src.slice(-5) === 'zn.js') {
                                        return false;
                                    }
                                }
                            });
                        }

                        if(_src){
                            _znPath = zn.ZN_JS_PATH =_src;
                        }else {
                            throw new Error('zn.js has not been included, please do it first.');
                        }
                    }

                    _slashIndex = _znPath.lastIndexOf(SLASH);
                    _currPath = _znPath.slice(0, _slashIndex >= 0 ? (_slashIndex + 1) : 0) + _currPath; // + '/';
                }
                else {
                    _currPath = './' + _currPath + '/';
                }
            }

            return _currPath;
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
                if (path.substring(0, 5) === 'node:') {
                    return callback(require(path.substring(5)));
                }
                var _path = __path.formatCurrentPath(path, parent);
                if(_path.slice(-1) === '/'){
                    _path += 'index.js';
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

                _path = _path.slice(-1) === '/' ? _path + 'index.js' : _path;
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
                    _currPath = _argv[1];

                this.sets({
                    path: _currPath,
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
                    this.set('status', MODULE_STATUS.LOADING);

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
                if (zn.is(path, Module)) {
                    path.load(callback);
                }else if (zn.is(path, 'string')) {
                    var _currPath = path;

                    if (_currPath.substring(0, 5) === 'node:') {
                        if (callback) {
                            callback(require(_currPath.substring(5)));
                        }
                        return true;
                    }

                    Module.loadModule(_currPath, callback, parent);
                }
            }
        }
    });

    zn.load = Loader.load;

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
                return obj !== null && typeof obj.then === 'function';
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
    var DateUtil = zn.class('DateUtil', {
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
                if (zn.GLOBAL.document){
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

        },
        methods: {
            init: function (){
                this._casePaths = [];
                this._caseMethods = [];
            },
            load: function (path){
                this._casePaths.push(path);
                return this;
            },
            run: function () {
                this.__testingCase();
            },
            __testingCase: function (){
                var _case = this._casePaths.shift(), _self = this;
                if(_case){
                    zn.load(_case, function (testCaseClass){
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
                zn.info('Test method '+methodname+' { second: '+seconds+'s, diff: '+_diff+' }');
            }
        }
    });

})(zn);