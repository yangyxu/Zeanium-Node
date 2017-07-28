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

                    if(!hasOwnProperty(_object, _key)){
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
                        return isFinite(value) ? value : '';
                    default:
                        return '';
                }
            }
        }
    });

})(zn);
