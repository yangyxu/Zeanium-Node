/**
 * Created by yangyxu on 9/17/14.
 */
zn.define(function () {

    return zn.collection('zn.db.common.collection.Table', {
        methods: {
            init: function (){
                this.super(Store.getStore({
                    host: '127.0.0.1',
                    user: 'root',
                    password: '123456',
                    port: 3306
                }));
            },
            __getCreateSql: function (table, fields) {
                var _table = table, _fieldsSql = [], _field = null;
                for(var i = 0, _len = fields.length; i < _len; i++){
                    _field = fields[i];
                    _fieldsSql.push(_field);
                }
                var _sql = "DROP TABLE IF EXISTS "+_table+";";
                var _sql = "";
                _sql += "CREATE TABLE "+_table+" (";
                _sql += _fieldsSql.join(',');
                _sql += ") ENGINE=innodb DEFAULT CHARSET=utf8;";
                return _sql;
            },
            create: function (table, fields){
                return this._store.execCommand(this.__getCreateSql(table, fields));
            },
            desc: function (table){
                return this._store.execCommand('DESC ' + table);
            },
            drop: function (table){
                return this._store.execCommand('DROP TABLE ' + table);
            },
            show: function (){
                return this._store.execCommand('SHOW TABLES;');
            },
            addField: function (table, field){
                return this._store.execCommand('ALTER TABLE ' + table + ' ADD ' + field + ';');
            },
            modifyField: function (table, field) {
                return this._store.execCommand('ALTER TABLE ' + table + ' MODIFY ' + field + ';');
            },
            dropField: function (table, field){
                this._store.execCommand('ALTER TABLE ' + table + ' DROP ' + field + ';');
            },
            useDB: function (db) {
                this._store.setDataBase(db);
            },
            insertRow: function (table, data){
                var _defer = zn.async.defer();
                var _connection = this._store.getConnection();
                var _keys = Object.keys(data).join(','),
                    _values = Object.values(data).join(',');
                var _result = _connection.command
                    .query('insert into {0} ({1}) values ({2});', [table, _keys, _values])
                    .then(function (data){
                        _defer.resolve(data.rows);
                    }).catch(function (e){
                        throw new Error(e.message);
                    }).finally(function (){
                        _connection.close();
                    });
                return _defer.promise;
            },
            updateRow: function (table, data, condiction){

            },
            deleteRow: function (table, condiction){

            }
        }
    });

});
