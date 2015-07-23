/**
 * Created by yangyxu on 9/17/14.
 */
zn.define(function () {
    var Async = zn.async;
    var String = zn.format.String;

    return zn.collection('zn.db.common.collection.Rights', {
        methods: {
            init: function (inStore, inModel){
                this.super(inStore, inModel);
            },
            deleteTreeModel: function (id){
                var _defer = Async.defer(),
                    _self = this,
                    _model = this._model;

                if(!+id){
                    _defer.reject('ID is invalide.');
                    return _defer.promise;
                }

                var _table = _model.__getTable();
                var _connection = this._store.getConnection();
                var _result = _connection.command
                    .query('select {0} from {1} where id={2};', ['id,pid,treeOrder', _table, id])
                    .then(function (data){
                        var _model = data.rows[0];

                        if(_model){
                            var _sql = String.formatString('delete from {0} where id={1};', _table, _model.id),
                                _pid = +_model.pid;

                            if(_pid){
                                _sql += String.formatString('update {0} set sons=sons-1 where id={1};', _table, _pid);
                                _sql += String.formatString('update {0} set treeOrder=treeOrder-1 where treeOrder>{1} and pid={2};', _table, _model.treeOrder, _pid);
                            }

                            _sql += String.formatString("delete from {0} where locate(',{1},',parentPath)<>0;", _table, _model.id);

                            return _connection.command.query(_sql);
                        }
                        else {
                            return Async.defer('NoDataError').promise;
                        }

                    }).then(function (data, error){
                        if(data=='NoDataError'){
                            _defer.resolve(error);
                        }else {
                            _defer.resolve(data.rows[0]);
                        }
                    }).finally(function (){
                        _connection.close();
                    });

                return _defer.promise;
            }
        }
    });

});