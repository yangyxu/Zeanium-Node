/**
 * Created by yangyxu on 9/17/14.
 */
zn.define(function () {

    var SQLS = {
        desc: 'desc {table};',
        drop: 'drop table {table};',
        show: 'show tables;',
        addField: 'alter table {table} add {field};',
        modifyField: 'alter table {table} modify {field};',
        dropField: 'alter table {table} drop {field};',
    };

    var Collection = zn.Class('zn.db.data.Collection', {
        properties: {
            store: {
                readonly: true,
                get: function (){
                    return this._store;
                }
            },
            Model: {
                readonly: true,
                get: function (){
                    return this._Model;
                }
            }
        },
        methods: {
            init: {
                auto: true,
                value: function (store, Model){
                    this._store = store;
                    this._Model = Model;
                }
            },
            beginTransaction: function (){
                return this._store.beginTransaction();
            },
            insert: function (values){
                return this._store.query(this._Model.getInsertSql({ values: values }));
            },
            select: function (argv){
                return this._store.query(this._Model.getSelectSql(argv));
            },
            selectOne: function (argv){
                var _defer = zn.async.defer();
                this.select(argv)
                    .then(function (rows){
                        _defer.resolve(rows[0]);
                    }, function (error){
                        _defer.reject(error);
                    });

                return _defer.promise;
            },
            paging: function (argv){
                return this._store.query(this._Model.getPagingSql(argv));
            },
            update: function (updates, where){
                return this._store.query(this._Model.getUpdateSql({ updates: updates, where: where }));
            },
            delete: function (where){
                return this._store.query(this._Model.getDeleteSql({ where : where }));
            }
        }
    });

    zn.Collection = function (){
        var _args = arguments,
            _meta = _args[0];

        return zn.Class(Collection, _meta);
    }

    return Collection;

});
