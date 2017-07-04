/**
 * Created by yangyxu on 9/17/14.
 */
zn.define(function () {

    return zn.Class({
        static: true,
        methods: {
            addTreeNode: function (table, model){
                var _pid = model.pid || 0;
                return zn.createTransactionBlock()
                    .query(zn.sql.select({
                        table: table,
                        fields: 'id,depth,parentPath,treeOrder',
                        where: {
                            id: _pid
                        }
                    }, {
                        table: table,
                        fields: 'max(treeOrder)+1 as treeOrder',
                        where: {
                            delFlag: 0,
                            pid: _pid
                        }
                    }))
                    .query('Insert node && Update parent node', function (sql, rows, fields){
                        var _pidModel = rows[0][0],
                            _treeOrder = rows[1][0].treeOrder|| 1,
                            _pid = _pidModel ? _pidModel.id: 0,
                            _depth = (_pidModel?_pidModel.depth:0) + 1,
                            _parentPath = (_pidModel?_pidModel.parentPath:'') + (_pid === 0 ? '' : _pid) + ',';

                        model.parentPath = _parentPath;
                        model.treeOrder = _treeOrder;
                        model.depth = _depth;

                        return zn.sql.insert({
                            table: table,
                            values: model
                        }) + zn.sql.update({
                            table: table,
                            updates: 'sons=sons+1',
                            where: {
                                id: _pid
                            }
                        });
                    });
            },
            deleteTreeNode: function (table, where){
                return zn.createTransactionBlock()
                    .query(zn.sql.select({
                        table: table,
                        fields: 'id, pid, treeOrder',
                        where: where
                    }))
                    .query('delete', function (sql, rows, fields, tran){
                        var _model = rows[0];
                        if(_model){
                            var _sql = 'delete from {0} where id={1};'.format(table, _model.id),
                                _pid = +_model.pid;

                            if(_pid){
                                _sql += 'update {0} set sons=sons-1 where id={1};'.format(table, _pid);
                            }
                            _sql += 'update {0} set treeOrder=treeOrder-1 where treeOrder>{1} and pid={2};'.format(table, _model.treeOrder, _pid);
                            _sql += "delete from {0} where locate(',{1},',parentPath)<>0;".format(table, _model.id);
                            return _sql;
                        } else {
                            return this.rollback('The node is not exist!'), false;
                        }
                    });
            },
            orderTreeNode: function (table, id, order){
                return zn.createTransactionBlock()
                    .query('select {0} from {1} where id={2};select count(id) as count from {1} where pid=(select pid from {1} where id={2});'.format('id,pid,treeOrder', table, id))
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

                            var _sql = 'update {0} set treeOrder={1} where treeOrder={2} and pid={3};'.format(table, _treeOrder, _newOrder, _model.pid);
                            _sql += 'update {0} set treeOrder={1} where id={2};'.format(table, _newOrder, _model.id);
                            return _sql;
                        } else {
                            return this.rollback('The node is not exist!'), false;
                        }
                    });
            }
        }
    });

});
