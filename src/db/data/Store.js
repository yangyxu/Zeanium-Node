/**
 * Created by yangyxu on 9/17/14.
 */
zn.define([
    '../connection/Connection',
    './Collection'
],function (Connection, Collection) {

    var Async = zn.async

    return zn.class('Store', {
        statics: {
            getStore: function (config) {
                return new this(config);
            }
        },
        properties: {

        },
        methods: {
            init: function (inConfig){
                this._config = inConfig||'default';
            },
            getConnection: function (){
                return Connection.getConnection(this._config);
            },
            getCollection: function (inModelClass, inCollection){
                return new (inCollection||Collection)(this, inModelClass);
            },
            createCollection: function (inModelClass) {
                var _defer = Async.defer(), _self = this;
                var _modelClass = inModelClass;
                if(true){
                    var _createSql = this.__propertiesToCreateSql(_modelClass);
                    var _connection = this.getConnection();
                    var _result = _connection.command
                        .query("DROP TABLE IF EXISTS "+_modelClass.__getTable()+";")
                        .then(function (data){
                            return _connection.command.query(_createSql);
                        }).then(function (data){
                            _defer.resolve(data);
                        }).catch(function (e){
                            _connection.close();
                        }).finally(function (){
                            _connection.close();
                        });
                }else {
                    throw new Error('The type of input model is not db.data.Model.');
                }
                return _defer.promise;
            },
            createCollections: function (modelAry) {
                this.__createTable(modelAry, this.getConnection());
            },
            __createTable: function (modelAry, _connection){
                var _modelClass = modelAry.shift(), _self = this;
                if(_modelClass){
                    var _createSql = this.__propertiesToCreateSql(_modelClass);
                    var _result = _connection.command
                        .query("DROP TABLE IF EXISTS "+_modelClass.__getTable()+";")
                        .then(function (data){
                            return _connection.command.query(_createSql);
                        }).then(function (data){
                            _self.__createTable(modelAry, _connection);
                        }).catch(function (e){
                            _connection.close();
                        });
                }else {
                    _connection.close();
                }

            },
            __propertiesToCreateSql: function (_modelClass){
                var _table = _modelClass.__getTable();
                var _fieldsSql = [], _self = this;
                _modelClass.__getFields(false, function (property, key){
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
                var _keys = [key], _typeAry = property.type;
                var _t1 = _typeAry[0], _t2 = _typeAry[1];
                _keys.push(_t1+(_t2?'('+_t2+')':''));
                if(property.primary){ property.notNull = true;_keys.push("PRIMARY KEY");}
                var _isnull = property.notNull?'NOT NULL':'';
                if(_isnull){ _keys.push(_isnull); }
                var _default = this.__getDefaultValue(property);
                if(_default){ _keys.push(_default); }
                var _autoIncrement = property.primary?'AUTO_INCREMENT':'';
                if(_autoIncrement){ _keys.push(_autoIncrement); }
                return _keys.join(' ');
            },
            __getDefaultValue: function (property) {
                if(property.default!==undefined){
                    var _type = property.type[0], _value = property.default;
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
        }
    });

});