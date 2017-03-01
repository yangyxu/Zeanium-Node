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
            setup: function (){
                var _defer = zn.async.defer();
                var _sql = 'drop database if exists ' + this._config.database + ';'
                _sql += 'create database if not exists ' + this._config.database + ';';
                var _config = zn.extend({}, this._config);
                _config.database = null;
                delete _config.database;
                _config.dateStrings = true;
                _config.multipleStatements = true;
                zn.info(_sql);
                var connection = mysql.createConnection(_config).query(_sql, function (err, rows){
                    if(err){
                        _defer.reject(err);
                    }else {
                        _defer.resolve(rows);
                    }
                });
                return _defer.promise;
            },
            create: function (){

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
            paging: function (argv){
                var _argv = zn.extend(argv, {
                    pageIndex: 0,
                    pageSize: 10
                });
            },
            pagingTable: function (table, fields, where, order, pageIndex, pageSize){
                var _defer = zn.async.defer();
                console.log(arguments);
                var _index = pageIndex || 1,
                    _size = pageSize || 10,
                    _start = (_index - 1) * _size,
                    _end = _index * _size,
                    _fields = fields,
                    _table = table;
                var _sql = zn.sql.select(_fields)
                            .from(_table)
                            .where(where)
                            .limit(_start, _size)
                            .orderBy(order)
                            .build() + ';';
                    _sql += zn.sql.select('count(*) as count').from(_table).where(where).build();
                return this.command.query(_sql);
            },
            createModel: function (inModelClass) {
                var _defer = zn.async.defer();
                this.command.query(inModelClass.getCreateSql())
                    .then(function (data, command){
                        _defer.resolve(data);
                        command.release();
                    });

                return _defer.promise;
            }
        }
    });

    zn.Store = Store;

    return Store;

});
