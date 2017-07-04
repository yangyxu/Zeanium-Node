/**
 * Created by yangyxu on 9/17/14.
 */
zn.define(['../schema/ConnectionPool'], function (ConnectionPool) {

    return zn.Class('zn.db.data.Store', {
        statics: {
            getStore: function (config) {
                return new this(config);
            }
        },
        methods: {
            init: {
                auto: true,
                value: function (inConfig){
                    this._pool = ConnectionPool.getPool(inConfig || {});
                }
            },
            beginTransaction: function (){
                return this._pool.beginTransaction();
            },
            query: function (){
                return this._pool.query.apply(this._pool, arguments);
            },
            createModel: function (ModelClass) {
                return this._pool.query(ModelClass.getCreateSql());
            },
            createModels: function (models){
                var _tran = this.beginTransaction(),
                    _defer = zn.async.defer(),
                    _table = null,
                    _model = null;
                for(var key in models){
                    _model = models[key];
                    _table = _model.getMeta('table');
                    if (_table&&!models[_table]){
                        _tran.query(_model.getCreateSql());
                    }
                }

                _tran.on('error', function (sender, err){
                    _defer.reject(err);
                }).on('finally', function (sender, data){
                    _defer.resolve(data);
                }).commit();

                return _defer.promise;
            }
        }
    });

});
