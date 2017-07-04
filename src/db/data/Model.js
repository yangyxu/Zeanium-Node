/**
 * Created by yangyxu on 9/17/14.
 */
zn.define(function () {

    var SQLS = {
        CREATE: 'DROP TABLE IF EXISTS {table};CREATE TABLE {table} ({fields}) ENGINE=innodb DEFAULT CHARSET=utf8;'
    };

    var Model = zn.Class('zn.db.data.Model', {
        partial: true,
        statics: {
            getTable: function (){
                return this.getMeta('table');
            },
            getCreateSql: function (){
                var _fields = [];
                this.getProperties(function (prop, key){
                    prop.name = key;
                    var _sql = this.__getPropertyCreateSql(prop);
                    if(props.primary){
                        _fields.unshift(_sql);
                    }else {
                        _fields.push(_sql);
                    }

                    return false;
                }, this);

                return SQLS.CREATE.format({
                    table: this.getTable(),
                    fields: _fields.join(',')
                });
            },
            __getPropertyCreateSql: function (property){
                var _key = property.name,
                    _type = prototype.type || [],
                    _t1 = _type[0],
                    _t2 = _type[1],
                    _keys = [_key];

                _keys.push(_t1+(_t2?'('+_t2+')':''));

                if(property.primary){
                    property.notNull = true;
                    _keys.push("PRIMARY KEY");
                }
                var _isnull = property.notNull?'NOT NULL':'';

                if(_isnull){
                    _keys.push(_isnull);
                }

                var _default = this.__getPropertyDefaultValue(property);

                if(_default){
                    _keys.push(_default);
                }
                var _autoIncrement = property.primary?'AUTO_INCREMENT':'';

                if(_autoIncrement){
                    _keys.push(_autoIncrement);
                }

                return _keys.join(' ');
            },
            __getPropertyDefaultValue: function (property) {
                if(property.default !== undefined){
                    var _value = property.default;
                    if(zn.is(_value, 'function')){
                        _value = _value.call(this, property, property.name);
                    }

                    switch(property.type[0].toLowerCase()){
                        case 'nvarchar':
                        case 'varchar':
                        case 'longtext':
                        case 'char':
                            _value = _value || '';
                            if(zn.is(_value, 'string')){
                                if(_value.indexOf('{') === 0 && _value.indexOf('}') === (_value.length-1)){
                                    _value = _value.substring(1, _value.length-1);
                                }else {
                                    _value = "'" + _value + "'";
                                }
                            }
                            break;
                        case 'date':

                            break;
                        case 'int':
                            _value = _value==null?0:_value;
                            break;
                    }

                    return 'DEFAULT '+_value;
                }

            }
        },
        properties: {
            table: {
                get: function (){
                    return this._table;
                }
            },
            props: {
                get: function (){
                    return this._props;
                }
            }
        },
        methods: {
            init: {
                auto: true,
                value: function (args){
                    this._table = this.constructor.getTable();
                    this._props = this.constructor.getProperties();
                    this.sets(args);
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
