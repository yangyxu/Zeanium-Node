/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    '../mysql/MySqlCommand',
    'node:mysql'
],function (MySqlCommand, mysql) {

    return zn.Class('Connection', {
        statics:{
            getConnection: function (inArgs){
                return new this(inArgs);
            }
        },
        events: ['connection','close'],
        properties: {
            command: null
        },
        methods: {
            init: function (inArgs){
                if(!inArgs){
                    zn.error('zn.db.Connection init method: inArgs is undefined.');
                    return false;
                }
                var _args = inArgs;
                _args.type = _args.type || 'mysql';
                this.sets(_args);
                switch(_args.type.toLowerCase()){
                    case 'mysql':
                        this.__connectMySql(_args);
                        this.set('command', new MySqlCommand({
                            connection: this._connection
                        }));
                        break;
                    case 'mssql':

                        break;
                }
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
                }catch(e){
                    zn.error(e.message);
                }
                return this;
            },
            __connectMySql: function (_args){
                var _connection = mysql.createConnection(_args);

                _connection.connect(function (err){
                    this.__handlerMySqlConnectError(err, _args);
                }.bind(this));

                _connection.on('error', function (err){
                    this.__handlerMySqlConnectError(err, _args);
                }.bind(this));

                this._connection = _connection;
            },
            __handlerMySqlConnectError: function (err, args) {
                if (err) {
                    // 如果是连接断开，自动重新连接
                    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                        zn.info("Reconnet MySql Server");
                        this.__connectMySql(args);
                    } else {
                        zn.error(err.stack || err);
                    }
                }
            }
        }
    });

});
