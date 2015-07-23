/**
 * Created by yangyxu on 9/17/14.
 */
zn.define(function () {
    var Async = zn.async;
    var String = zn.format.String;

    return zn.collection('zn.db.common.collection.Tree', {
        methods: {
            init: function (inStore, inModel){
                this.super(inStore, inModel);
            },
            addTreeModel: function (inModel){
                var _defer = Async.defer(),
                    _self = this;

                inModel = this.checkModel(inModel);
                if(!inModel){
                    _defer.reject('Error Model Type: DataModel must be extend TreeModel.');
                    return _defer.promise;
                }

                var _table = inModel.constructor.__getTable()
                var _connection = this._store.getConnection();
                var _result = _connection.command
                    .query('select {0} from {1} where id={2};select max(treeOrder)+1 as treeOrder from {1} where delFlag=0 and pid={2};', ['id,depth,parentPath,treeOrder', _table, inModel.pid||0])
                    .then(function (data){
                        var _pidModel = data.rows[0][0],
                            _treeOrder = data.rows[1][0].treeOrder|| 1,
                            _pid = _pidModel ? _pidModel.id: 0,
                            _depth = (_pidModel?_pidModel.depth:0) + 1,
                            _parentPath = (_pidModel?_pidModel.parentPath:'') + (_pid === 0 ? '' : _pid) + ',';

                        var _fieldsValues = inModel.__getInsertFieldsValues();
                        var _fields = _fieldsValues[0].concat(['parentPath', 'treeOrder', 'depth']).join(','),
                            _values = _fieldsValues[1].concat([_parentPath, _treeOrder, _depth]);

                        _values.forEach(function (value, index){
                            if(zn.is(value, 'string')){
                                _values[index] = "'"+_values[index]+"'";
                            }
                        });

                        _values = _values.join(',');

                        return _connection.command
                            .query('insert into {0} ({1}) values ({2});update {0} set {3} where id={4};', [_table, _fields, _values, 'sons=sons+1', _pid]);

                    }).then(function (data){
                        _defer.resolve(data.rows[0]);
                    }).finally(function (){
                        _connection.close();
                    });

                return _defer.promise;
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
            },
            orderTreeModel: function (id, order){
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
                    .query('select {0} from {1} where id={2};select count(id) as count from {1} where pid=(select pid from {1} where id={2});', ['id,pid,treeOrder', _table, id])
                    .then(function (data){
                        var _rows = data.rows,
                            _model = _rows[0][0],
                            _count = _rows[1][0].count;

                        if(_model){
                            var _treeOrder = +_model.treeOrder,
                                _newOrder = _treeOrder - 1;

                            if(order=='down'){
                                _newOrder = _treeOrder + 1;
                            }

                            if(_newOrder < 1 ){
                                _newOrder = 1;
                            }

                            if(_newOrder > _count){
                                _newOrder = _count;
                            }

                            var _sql = String.formatString('update {0} set treeOrder={1} where treeOrder={2} and pid={3};', _table, _treeOrder, _newOrder, _model.pid);
                            _sql += String.formatString('update {0} set treeOrder={1} where id={2};', _table, _newOrder, _model.id);

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