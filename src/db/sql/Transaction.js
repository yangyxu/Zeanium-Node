/**
 * Created by yangyxu on 8/20/14.
 */
zn.define(function () {

    return zn.Class({
        events: ['rollback', 'error', 'commit', 'finally'],
        properties: {
            command: null
        },
        methods: {
            init: function (pool){
                this._pool = pool;
                this._queue = zn.queue({});
                this._queue.finally(function (){
                    this._connection.release();
                    this._connection = null;
                    this.destroy();
                }.bind(this));
            },
            begin: function (before, after){
                var _self = this;
                this._queue.push(function (task){
                    _self._pool.getConnection(function (err, connection){
                        before&&before(err, connection);
                        if(err){
                            _self.__finally(err);
                        } else {
                            _self._connection = connection;
                            task.done(connection);
                        }
                    });
                }).push(function (task, connection){
                    connection.query('START TRANSACTION', function (err, rows, fields) {
                        after && after(err, rows, fields, _self);
                        if(err){
                            _self.rollback(err);
                        } else {
                            task.done(connection, rows, fields);
                        }
                    });
                });

                return this;
            },
            query: function(query, before, after){
                if(!query){ return this; }
                var _self = this,
                    _callback = null;
                this._queue.push(function (task, connection, rows, fields){
                    if(before){
                        _callback = before(query, rows, fields, _self);
                        if(typeof _callback == 'string'){
                            query = _callback;
                        }
                    }
                    if(_callback === false){
                        _self._queue.destroy();
                    } else if(_callback === -1){
                        task.done(connection, rows, fields);
                    } else {
                        zn.debug('Transaction Query SQL: ', query);
                        connection.query(query, function (err, rows, fields){
                            after && after(err, rows, fields, _self);
                            if(err){
                                _self.rollback(err);
                            }else {
                                task.done(connection, rows, fields);
                            }
                        });
                    }
                });

                return this;
            },
            commit: function (before, after){
                var _self = this;
                this._queue.push(function (task, connection, rows, fields){
                    before && before(rows, fields);
                    connection.query('COMMIT', function (err, rows, fields){
                        after && after(err, rows, fields);
                        var _data = { error: err, rows: rows, fields: fields };
                        if(err){
                            _self.rollback(err);
                        }else {
                            _self.fire('commit', _data);
                            _self.fire('finally', _data);
                            _self._queue.destroy();
                        }
                    });
                }).start();

                return this;
            },
            rollback: function (error, callback){
                var _self = this;
                _self._queue.clear();
                _self.fire('rollback');
                _self.__finally(error);
                if(!this._connection){
                    return _self._queue.destroy(), this;
                }
                this._connection.query('ROLLBACK', function (err, rows, fields){
                    callback && callback(err, rows, fields);
                    _self._queue.destroy();
                });

                return this;
            },
            __finally: function (error){
                if(error) {
                    this.fire('error', error);
                }
                this.fire('finally', error);
            }
        }
    });

});
