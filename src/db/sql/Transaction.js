/**
 * Created by yangyxu on 8/20/14.
 */
zn.define(function () {

    return zn.Class({
        events: ['rollback','commit'],
        properties: {
            command: null
        },
        methods: {
            init: function (pool){
                this._pool = pool;
                this._queue = zn.queue({});
                this._queue.finally(function(){
                    if(this._connection){
                        this._connection.release();
                    }
                }, this);
            },
            begin: function (){
                var _self = this;
                this._queue.push(function (task){
                    _self._pool.getConnection(function (err, connection){
                        if(err){
                            _self.rollback();
                        } else {
                            _self._connection = connection;
                            task.done(connection);
                        }
                    });
                }).push(function (task, connection){
                    connection.query('START TRANSACTION', function (err, rows, fields) {
                        if(err){
                            _self.rollback();
                        } else {
                            task.done(connection, rows, fields);
                        }
                    });
                });

                return this;
            },
            query: function(query, callback){
                if(!query){ return this; }
                var _self = this;
                this._queue.push(function (task, connection, rows, files){
                    if(callback){
                        var _callback = callback(query, rows, files);
                        if(typeof _callback == 'string'){
                            query = _callback;
                        }
                    }
                    connection.query(query, function (err, rows, files){
                        if(err){
                            _self.rollback();
                        }else {
                            task.done(connection, rows, files);
                        }
                    });
                });

                return this;
            },
            commit: function (callback){
                var _self = this;
                this._queue.push(function (task, connection, rows, files){
                    connection.query('COMMIT', function (err, rows, files){
                        if(err){
                            _self.rollback();
                        } else {
                            task.done(connection, rows, files);
                        }
                        callback && callback(err, rows, files);
                    });
                }).start();
            },
            rollback: function (){
                this._queue.clear();
                this._connection.query('ROLLBACK', function (err, rows, files){
                    if(err){

                    } else {

                    }
                }.bind(this));
            }
        }
    });

});
