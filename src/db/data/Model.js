/**
 * Created by yangyxu on 9/17/14.
 */
zn.define(function () {

    var Model = zn.class('zn.db.data.Model', {
        statics: {
            __getTable: function (){
                return this.getMeta('table');
            },
            __getFields: function (ifFilterPrimary, onCheckItem) {
                var _properties = this.__getProperties(this);
                var _fields = [], _self = this, _onCheckItem = onCheckItem||function (){};
                for(var _key in _properties){
                    var _property  = _properties[_key];
                    _onCheckItem(_property, _key);
                    if(!ifFilterPrimary){
                        var _format = _property.format;
                        if(_format){
                            _property.alias = _format.replace(/\{\}/g, _key)+' as '+_key;
                        }
                        var _convert = _property.convert;
                        if(_convert){
                            _fields.push(_convert.replace(/\{\}/g, _key)+' as '+_key+'_convert');
                        }
                    }
                    _key = _property.alias||_key;
                    if(_property.primary){
                        _self._primary = _key;
                        if(ifFilterPrimary){
                            continue;
                        }
                        _fields.unshift(_key);
                    }else {
                        _fields.push(_key);
                    }
                }
                return _fields;
            },
            __getProperties: function (modelClass) {
                var _super = modelClass.__super__;
                var _properties = modelClass.getMeta('properties');
                if(_super){
                    zn.extend(_properties, this.__getProperties(_super));
                }
                return _properties;
            }
        },
        methods: {
            init: function (args){
                this._table = this.constructor.__getTable();
                this._fields = this.constructor.__getFields();
                this.sets(args);
            },
            toJson: function () {
                var _self = this, _data = {};
                zn.each(this._fields, function (field, key){
                    _data[field] = _self.get(field);
                });
                return _data;
            },
            __getInsertFieldsValues: function () {
                var _self = this, _kAry = [], _vAry = [];
                this.constructor.__getFields(true, function (field, key){
                    var _value = _self.get(key)||field.default;
                    if(_value!=null&&!field.ignore){
                        _kAry.push(key);
                        _vAry.push(_self.get(key)||field.default);
                    }
                });
                return [_kAry, _vAry];
            },
            __getUpdateFieldsValues: function () {
                var _self = this, _updates = {};
                this.constructor.__getFields(true, function (field, key){
                    var _value = _self.get(key)||_self.__formatAutoUpdate(field.auto_update);
                    if(_value!=null&&_value!=field.default){
                        _updates[key] = _value;
                    }
                });
                return _updates;
            },
            __formatAutoUpdate: function (auto_update){
                switch(zn.type(auto_update)){
                    case 'date':
                        return auto_update.toString();
                    case 'string':
                        return auto_update;
                }
            }
        }
    });

    zn.model = function (){
        var _args = arguments,
            _name = _args[0],
            _meta = _args[1];

        _meta.table = _name;

        return zn.class(_name, Model, _meta);
    }

    return Model;



});