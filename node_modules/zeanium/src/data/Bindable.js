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
