/**
 * Created by yangyxu on 9/17/14.
 */
zn.define(function () {

    var Collection = zn.Class('zn.db.data.Collection', {
        methods: {
            init: {
                auto: true,
                value: function (store, ModelClass){
                    this._store = store;
                    this._ModelClass = ModelClass;
                }
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
            usedb: function (db) {
                this._store.setDataBase(db);
            }
        }
    });

    zn.Collection = function (){
        var _args = arguments,
            _name = _args[0],
            _meta = _args[1];

        return zn.Class(_name, Collection, _meta);
    }

    return Collection;

});
