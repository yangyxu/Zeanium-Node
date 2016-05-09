/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    '../mysql/MySqlCommand',
    'node:mysql'
], function (MySqlCommand, mysql) {

    return zn.Class('ConnectionPool', {
        statics: {
            getPool: function (config){
                new this(config);
            }
        },
        properties: {

        },
        methods: {
            init: function (config){
                switch (config.type.toLowerCase()) {
                    case 'mysql':
                        this._pool = mysql.createPool(zn.extend({
                            "dateStrings": true,
                            "multipleStatements": true
                        }, config));
                        break;
                    case 'mongo':
                        this._pool = mongo.createPool(zn.extend({
                            "dateStrings": true,
                            "multipleStatements": true
                        }, config));
                        break;
                }
            },
            getCommand: function(){
                var _defer = zn.async.defer();
                this._pool.getConnection(function (err, connection){
                    if (err){
                        zn.error(err.message);
                        _defer.reject(err);
                        Async.catch(err);
                    }else {
                        this.__connectMySql(_args);
                        this.set('command', );
                        _defer.resolve(new MySqlCommand({
                            connection: connection
                        }));
                    }
                });

                return _defer.promise;
            }
        }
    });

});
