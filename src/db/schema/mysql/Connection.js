/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    '../Connection'
], function (Connection) {

    return zn.Class(Connection, {
        properties: {
            connection: null
        },
        methods: {
            init: function (connection){
                this.setNativeConnection(connection);
            },
            setNativeConnection: function (connection){
                if(connection){
                    this._connection = connection;
                    connection.connect(function (err){
                        if(err){
                            this.__handlerConnectError(err);
                        }else {
                            this.fire('connect');
                        }
                    }.bind(this));
                    connection.on('error', this.__handlerConnectError);
                }else {
                    zn.error('The mysql connection is null.');
                }
            },
            query: function () {
                var _defer = zn.async.defer(),
                    _query = _argv.shift().format(__slice.call(arguments)),
                    _self = this;

                if(!this._connection){
                    this.__onQueryError(_defer, 'The mysql connection is null.');
                }else {
                    zn.debug(_query);
                    this._connection.query(_query, function(err, rows, fields) {
                        if (err){
                            _self.__onQueryError(_defer, 'MySql Connection query error: ' + err.message);
                        }else {
                            _defer.resolve(rows, fields, _self);
                        }

                        _self.release();
                    });
                }

                return _defer.promise;
            },
            release: function (){
                if(this._connection){
                    this._connection.release();
                }

                return this;
            },
            reconnect: function(){
                return this._connection.connect(), this;
            },
            close: function () {
                try{
                    if(this._connection.state=='disconnected'){
                        return this;
                    }
                    this._connection.end();
                    this.fire('close');
                }catch(e){
                    zn.error(e.message);
                }

                return this;
            },
            __onQueryError: function (defer, msg){
                defer.reject(msg, this);
                zn.async.catch(msg, this);
                zn.error(msg);
                if(zn._response){
                    zn._response.error(msg);
                }
            },
            __handlerConnectError: function (err) {
                if (err) {
                    // 如果是连接断开，自动重新连接
                    this.fire('error', err);
                    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                        zn.info("Reconnet MySql Server");
                        this.fire('disconnect', err);
                    } else {
                        zn.error(err.stack || err);
                    }
                }
            }
        }
    });

});
