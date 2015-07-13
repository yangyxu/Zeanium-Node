/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    './config',
    '../mysql/MySqlCommand',
    'node:mysql'
],function (config, MySqlCommand, mysql) {

    return zn.class('Connection', {
        statics:{
            getConnection: function (inArgs){
                return new this(inArgs);
            }
        },
        events: ['connection','close'],
        properties: {
            dbType: null,
            command: null
        },
        methods: {
            init: function (inArgs){
                var _args = inArgs||config['default'];
                if(line.type(inArgs)=='string'){
                    _args = config[_args];
                }
                this.sets(_args);
                switch(this.get('dbType').toLowerCase()){
                    case 'mysql':
                        this.__connectMySql(_args);
                        this.set('command', new MySqlCommand({connection: this._connection}));
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
                        this.__connectMySql(args);
                    } else {
                        console.error(err.stack || err);
                    }
                }
            }
        }
    });

});