/**
 * Created by yangyxu on 9/17/14.
 */
zn.define(function () {
    var Async = zn.async;
    var String = zn.format.String;

    return zn.collection('zn.db.common.action.Base', {
        methods: {
            init: function (inStore){
                this.super(inStore);
            },
            addBaseModel: function (table, model){
                var _defer = Async.defer();

                var _fields = [],
                    _values = [];
                for(var key in model){
                    _fields.push(key);
                    _values.push(model[key]);
                }

                var _connection = this._store.getConnection();
                var _result = _connection.command
                    .query('insert into {0} ({1}) values ({2});', [table, _fields, _values])
                    .then(function (data){
                        _defer.resolve(data.rows[0]);
                    }).finally(function (){
                        _connection.close();
                    });

                return _defer.promise;
            },
            updateBaseModel: function (table, model, id){
                var _defer = Async.defer();
                var _updates = [];
                for(var key in model){
                    _updates.push(key + '=' + model[key]);
                }

                var _table = table;
                var _connection = this._store.getConnection();
                var _result = _connection.command
                    .query('update {0} set {1} where id={2};', [table, _updates.join(','), id])
                    .then(function (data){
                        _defer.resolve(data.rows[0]);
                    }).finally(function (){
                        _connection.close();
                    });

                return _defer.promise;
            }
        }
    });

});
