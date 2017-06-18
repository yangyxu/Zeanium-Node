/**
 * Created by yangyxu on 9/17/14.
 */
zn.define(function () {

    return zn.Class({
        static: true,
        methods: {
            addTreeNode: function (table, model){
                var _model = model||{},
                    _table = table;

                var _fields = [],
                    _values = [];
                for(var key in _model){
                    _fields.push(key);
                    _values.push(_model[key]);
                }

                return zn.createTransactionBlock()
                    .query('select {0} from {1} where id={2};select max(treeOrder)+1 as treeOrder from {1} where delFlag=0 and pid={2};'.format('id,depth,parentPath,treeOrder', _table, _model.pid||0))
                    .query('insert into {0} ({1}) values ({2});update {0} set {3} where id={4};', function (sql, rows, fields){
                        var _pidModel = rows[0][0],
                            _treeOrder = rows[1][0].treeOrder|| 1,
                            _pid = _pidModel ? _pidModel.id: 0,
                            _depth = (_pidModel?_pidModel.depth:0) + 1,
                            _parentPath = (_pidModel?_pidModel.parentPath:'') + (_pid === 0 ? '' : _pid) + ',';

                        _fields = _fields.concat(['parentPath', 'treeOrder', 'depth']).join(',');
                        _values = _values.concat([_parentPath, _treeOrder, _depth]);

                        _values.forEach(function (value, index){
                            if(zn.is(value, 'string')){
                                if(value.indexOf('{') === 0 && value.indexOf('}') === (value.length-1)){
                                    _values[index] = value.substring(1, value.length-1);
                                }else {
                                    _values[index] = "'" + value + "'";
                                }
                            }
                        });

                        _values = _values.join(',');

                        return sql.format(_table, _fields, _values, 'sons=sons+1', _pid);
                    });
            },
            deleteTreeNode: function (table, where){
                var _where = where||{},
                    _table = table;

                if(zn.is(_where, 'number')){
                    _where = { id: _where };
                }

                return zn.createTransactionBlock()
                    .query(zn.sql.select('id,pid,treeOrder').from(_table).where(_where).build())
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
                            return this.rollback('The node is not exist!'), false;
                        }
                    });
            },
            orderTreeNode: function (store, table, id, order){
                var _table = table;

                return zn.createTransactionBlock()
                    .query('select {0} from {1} where id={2};select count(id) as count from {1} where pid=(select pid from {1} where id={2});'.format('id,pid,treeOrder', _table, id))
                    .query('order', function (sql, rows, fields){
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
                            return this.rollback('The node is not exist!'), false;
                        }
                    });
            }
        }
    });

});
