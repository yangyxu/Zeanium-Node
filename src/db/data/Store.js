/**
 * Created by yangyxu on 9/17/14.
 */
zn.define([
    '../mysql/MySqlCommand',
    '../sql/Transaction',
    'node:mysql'
],function (MySqlCommand, Transaction, mysql) {

    var Store = zn.Class('zn.db.data.Store', {
        statics: {
            getStore: function (config) {
                return new this(config);
            }
        },
        properties: {
            command: {
                readonly: true,
                get: function (){
                    return new this._commandClass(this._pool);
                }
            }
        },
        methods: {
            init: {
                auto: true,
                value: function (inConfig){
                    this._config = inConfig || {};
                    switch (inConfig.type.toLowerCase()) {
                        case 'mysql':
                            this._pool = mysql.createPool(zn.extend({
                                "dateStrings": true,
                                "multipleStatements": true
                            }, inConfig));
                            this._commandClass = MySqlCommand;
                            break;
                        case 'mongo':

                            break;
                    }
                }
            },
            beginTransaction: function (){
                return (new Transaction(this._pool)).begin();
            },
            setDataBase: function (value){
                this._config.database = value;
            },
            create: function (name){
                return this.query('CREATE DATABASE ' + name);
            },
            drop: function (){
                return this.query('DROP DATABASE ' + name);
            },
            show: function (){
                return this.query('SHOW DATABASES;');
            },
            query: function (sql){
                return this.command.query(sql);
            },
            createCollection: function (inModelClass) {
                var _defer = zn.async.defer(),
                    _self = this,
                    _modelClass = inModelClass;

                if(true){
                    var _createSql = this.__propertiesToCreateSql(_modelClass);
                    var _result = this.command.query("DROP TABLE IF EXISTS " + _modelClass.__getTable() + ";")
                        .then(function (data, command){
                            return command.query(_createSql);
                        }).then(function (data, command){
                            _defer.resolve(data);
                            command.release();
                        });
                }else {
                    throw new Error('The type of input model is not db.data.Model.');
                }

                return _defer.promise;
            },
            createCollections: function (modelAry) {
                this.__createTable(modelAry, this.getConnection());
            },
            __createTable: function (modelAry, command){
                var _modelClass = modelAry.shift(),
                    _self = this;

                if(_modelClass){
                    var _createSql = _modelClass.__propertiesToCreateSql();
                    var _result = (command||this.command)
                        .query("DROP TABLE IF EXISTS "+_modelClass.__getTable()+";")
                        .then(function (data, command){
                            return command.query(_createSql);
                        }).then(function (data, command){
                            _self.__createTable(modelAry, command);
                        })
                }else {
                    _connection.close();
                }

            }
        }
    });

    zn.Store = Store;

    return Store;

});
