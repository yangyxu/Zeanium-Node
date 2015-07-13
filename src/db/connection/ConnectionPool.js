/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    './config',
    '../mysql/MySqlCommand',
    'node:mysql'
],function (config, MySqlCommand, mysql) {

    return zn.class('SqlConnection', {
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
                var _args = inArgs||config['default'], _connection;
                if(line.type(inArgs)=='string'){
                    _args = config[_args];
                }
                this.sets(_args);
                switch(this.get('dbType').toLowerCase()){
                    case 'mysql':
                        _connection = mysql.createConnection(_args);
                        _connection.connect();
                        this.set('command', new MySqlCommand({connection: _connection}));
                        break;
                    case 'mssql':

                        break;
                }
                this._connection = _connection;
            },
            reconnect: function(){
                return this._connection.connect(), this;
            },
            close: function () {
                return this._connection.end(), this;
            }
        }
    });

});