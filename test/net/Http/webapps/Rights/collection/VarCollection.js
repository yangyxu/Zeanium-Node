zn.define([
    'db',
    '../model/Var'
], function (db, Var) {

    return zn.class("VarCollection", db.data.Collection, {
        methods: {
            init: function (inStore, inModel){
                this.super(inStore, inModel);
                this._model = Var;
            },
            getVars: function (varId){
                var _defer = zn.async.defer(),
                    _self = this;

                try{
                    var _table = this._model.__getTable();
                    var _fields = this._model.__getFields(false);
                    var _connection = this._store.getConnection();
                    var _result = _connection.command
                        .select(['id as name', 'nodeName as value'])
                        .from(_table)
                        .where({'pid':varId})
                        .query()
                        .then(function (data){
                            _defer.resolve(data.rows);
                        }).catch(function (e){
                            throw new Error(e.message);
                        }).finally(function (){
                            _connection.close();
                        });
                }catch(e){
                    throw new Error(e.message);
                }

                return _defer.promise;
            }
        }
    })
})