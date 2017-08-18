/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    '../ConnectionPool',
    './Connection'
], function (ConnectionPool, Connection) {

    return zn.Class('zn.db.schema.MySqlConnectionPool', ConnectionPool, {
        methods: {
            init: function (config){
                this._config = zn.extend({
                    dateStrings: true,
                    multipleStatements: true
                }, config);

                this._pool = require('mysql').createPool(this._config);
            },
            setConfig: function (config){
                return this._config = config, this;
            },
            getConnection: function(callback){
                this._pool.getConnection(function (err, connection){
                    callback && callback(err, connection);
                }.bind(this));

                return this;
            },
            createDataBase: function (database){
                var _config = zn.extend({}, this._config),
                    _database = database || _config.database,
                    _sql = 'drop database if exists {0};create database if not exists {0};'.format(_database);
                _config.database = null;
                delete _config.database;

                return this.__query(_sql, _config);

            },
            query: function (){
                var _argv = Array.prototype.slice.call(arguments),
                    _sql = _argv.shift();
                if(_argv.length){
                    _sql = _sql.format(_argv);
                }

                return this.__query(_sql);
            },
            __query: function (sql){
                var _defer = zn.async.defer();
                this.__getNativeConnection(function (connection){
                    zn.debug('ConnectionPool query: ' + sql);
                    connection.query(sql, function (err, rows){
                        if(err){
                            zn.error('ConnectionPool connection query error: ', err.stack);
                            console.log(err.stack);
                            _defer.reject(err);
                        }else {
                            _defer.resolve(rows);
                        }

                        connection.release();
                    });
                }, function (err){
                    _defer.reject(err);
                });

                return _defer.promise;
            },
            __getNativeConnection: function (success, error){
                this._pool.getConnection(function (err, connection){
                    if (err){
                        zn.error('ConnectionPool getConnection error: ', err.message);
                        console.log(err.stack);
                        error && error(err);
                    }else {
                        success && success(connection);
                    }
                }.bind(this));
            }
        }
    });

});
