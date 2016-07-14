/**
 * Created by yangyxu on 9/17/14.
 */
zn.define(function () {

    return zn.Action({
        methods: {
            addNode: function (data){
                return this.addTreeNode(data);
            },
            deleteNode: function (where){
                return this.deleteTreeNode(where);
            },
            addTreeNode: function (model){
                var _defer = zn.async.defer();
                var _model = model||{},
                    _table = this._table;

                var _fields = [],
                    _values = [];
                for(var key in model){
                    _fields.push(key);
                    _values.push(model[key]);
                }

                this.beginTransaction()
                    .query('select {0} from {1} where id={2};select max(treeOrder)+1 as treeOrder from {1} where delFlag=0 and pid={2};'.format('id,depth,parentPath,treeOrder', _table, _model.pid||0))
                    .query('insert into {0} ({1}) values ({2});update {0} set {3} where id={4};', function (sql, rows, fields, tran){
                        var _pidModel = rows[0][0],
                            _treeOrder = rows[1][0].treeOrder|| 1,
                            _pid = _pidModel ? _pidModel.id: 0,
                            _depth = (_pidModel?_pidModel.depth:0) + 1,
                            _parentPath = (_pidModel?_pidModel.parentPath:'') + (_pid === 0 ? '' : _pid) + ',';

                        _fields = _fields.concat(['parentPath', 'treeOrder', 'depth']).join(',');
                        _values = _values.concat([_parentPath, _treeOrder, _depth]);

                        _values.forEach(function (value, index){
                            if(zn.is(value, 'string')){
                                _values[index] = "'"+_values[index]+"'";
                            }
                        });
                        _values = _values.join(',');
                        return sql.format(_table, _fields, _values, 'sons=sons+1', _pid);
                    }).commit().on('finally', function (sender, data){
                        if(data.rows){
                            _defer.resolve(data.rows);
                        }else {
                            _defer.reject(data);
                        }
                    });

                    return _defer.promise;
            },
            deleteTreeNode: function (where){
                var _defer = zn.async.defer();
                var _where = where||{},
                    _table = this._table;

                /*
                if(zn.is(_where, 'number')){
                    _where = { id: _where };
                }*/
                this.beginTransaction()
                    .query('select {0} from {1} where id={2};'.format('id,pid,treeOrder', _table, _where))
                    .query('delete', function (sql, rows, fields, tran){
                        var _model = rows[0];
                        if(_model){
                            var _sql = 'delete from {0} where id={1};'.format(_table, _model.id),
                                _pid = +_model.pid;

                            if(_pid){
                                _sql += 'update {0} set sons=sons-1 where id={1};'.format(_table, _pid);
                            }
                            _sql += 'update {0} set treeOrder=treeOrder-1 where treeOrder>{1} and pid={2};'.format(_table, _model.treeOrder, _pid);
                            _sql += "delete from {0} where locate(',{1},',parentPath)<>0;".format(_table, _model.id);
                            return _sql;
                        } else {
                            return tran.rollback('The node is not exist!'), false;
                        }
                    }).commit().on('finally', function (sender, data){
                        if(data.rows){
                            _defer.resolve(data.rows);
                        }else {
                            _defer.reject(data.message || data);
                        }
                    });

                    return _defer.promise;
            },
            orderTreeNode: function (id, order){
                var _defer = zn.async.defer(),
                    _table = this._table;

                this.beginTransaction()
                    .query('select {0} from {1} where id={2};select count(id) as count from {1} where pid=(select pid from {1} where id={2});'.format('id,pid,treeOrder', _table, id))
                    .query('order', function (sql, rows, fields, tran){
                        var _model = rows[0][0],
                            _count = rows[1][0].count;

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

                            var _sql = 'update {0} set treeOrder={1} where treeOrder={2} and pid={3};'.format(_table, _treeOrder, _newOrder, _model.pid);
                            _sql += 'update {0} set treeOrder={1} where id={2};'.format(_table, _newOrder, _model.id);

                            return _sql;
                        } else {
                            return tran.rollback('The node is not exist!'), false;
                        }
                    }).commit().on('finally', function (sender, data){
                        if(data.rows){
                            _defer.resolve(data.rows);
                        }else {
                            _defer.reject(data.message || data);
                        }
                    });

                return _defer.promise;
            }
        }
    });

});
