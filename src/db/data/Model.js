/**
 * Created by yangyxu on 9/17/14.
 */
zn.define(function () {

    var Model = zn.Class('zn.db.data.Model', {
        statics: {
            getTable: function (){
                return this.getMeta('table');
            },
            getFields: function (ifFilterPrimary, onCheckItem) {
                var _properties = this.getProperties(this);
                var _fields = [],
                    _self = this,
                    _onCheckItem = onCheckItem||function (){};

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
            getCreateSql: function (){
                var _table = this.getTable(),
                    _fieldsSql = [],
                    _self = this;

                this.getFields(false, function (property, key){
                    var _propertySql = _self.__propertyToCreateSql(property, key);

                    if(key=='id'){
                        _fieldsSql.unshift(_propertySql);
                    }else {
                        _fieldsSql.push(_propertySql);
                    }
                });
                var _sql = "DROP TABLE IF EXISTS "+_table+";";
                var _sql = "";
                _sql += "CREATE TABLE "+_table+" (";
                _sql += _fieldsSql.join(',');
                _sql += ") ENGINE=innodb DEFAULT CHARSET=utf8;";
                return _sql;
            },
            __propertyToCreateSql: function (property, key){
                var _keys = [key],
                    _typeAry = property.type,
                    _t1 = _typeAry[0],
                    _t2 = _typeAry[1];

                _keys.push(_t1+(_t2?'('+_t2+')':''));

                if(property.primary){
                    property.notNull = true;
                    _keys.push("PRIMARY KEY");
                }
                var _isnull = property.notNull?'NOT NULL':'';

                if(_isnull){
                    _keys.push(_isnull);
                }
                var _default = this.__getDefaultValue(property);

                if(_default){
                    _keys.push(_default);
                }
                var _autoIncrement = property.primary?'AUTO_INCREMENT':'';

                if(_autoIncrement){
                    _keys.push(_autoIncrement);
                }

                return _keys.join(' ');
            },
            __getDefaultValue: function (property) {
                if(property.default !== undefined){
                    var _type = property.type[0],
                        _value = property.default;
                    switch(_type){
                        case 'nvarchar':
                        case 'varchar':
                            _value = "'"+_value+"'";
                            break;
                        case 'date':

                            break;
                        case 'int':

                            break;
                    }

                    return 'DEFAULT '+_value;
                }else {
                    return null;
                }
            }
        },
        methods: {
            init: {
                auto: true,
                value: function (args){
                    this._table = this.constructor.getTable();
                    this._fields = this.constructor.getFields();
                    this.sets(args);
                }
            },
            __getInsertFieldsValues: function () {
                var _kAry = [],
                    _vAry = [];

                this.constructor.getFields(true, function (field, key){
                    var _value = this.get(key);
                    if(zn.is(_value, 'object')){
                        _value = _value.value;
                    }
                    _value = _value || field.default;
                    if(_value!=null&&!field.ignore){
                        _kAry.push(key);
                        _vAry.push(_value);
                    }
                }.bind(this));

                return [_kAry, _vAry];
            },
            __getUpdateFieldsValues: function () {
                var _self = this,
                    _updates = {};
                this.constructor.getFields(true, function (field, key){
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

    zn.Model = function (){
        var _args = arguments,
            _name = _args[0],
            _meta = _args[1];

        _meta.table = _name;
        return zn.Class(_name, Model, _meta);
    }

    return Model;
});
