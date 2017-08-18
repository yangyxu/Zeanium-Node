/**
 * Created by yangyxu on 9/17/14.
 */
zn.define(function () {

    return zn.Class({
        static: true,
        methods: {
            addNode: function (table, model){
                var _pid = model.pid || 0;
                return zn.createTransactionBlock()
                    .query(zn.sql.select({
                        table: table,
                        fields: 'id, zn_tree_depth, zn_tree_parent_path,zn_tree_order',
                        where: {
                            id: _pid
                        }
                    }, {
                        table: table,
                        fields: 'max(zn_tree_order)+1 as zn_tree_order',
                        where: {
                            delFlag: 0,
                            pid: _pid
                        }
                    }))
                    .query('Insert node && Update parent node', function (sql, rows, fields){
                        var _pidModel = rows[0][0],
                            _treeOrder = rows[1][0].zn_tree_order|| 1,
                            _pid = _pidModel ? _pidModel.id: 0,
                            _depth = (_pidModel?_pidModel.zn_tree_depth:0) + 1,
                            _parentPath = (_pidModel?_pidModel.zn_tree_parent_path:'') + (_pid === 0 ? '' : _pid) + ',';
                        if(typeof model == 'string'){
                            model = JSON.parse(model);
                        }
                        model.zn_tree_parent_path = _parentPath;
                        model.zn_tree_order = _treeOrder;
                        model.zn_tree_depth = _depth;
                        return zn.sql.insert({
                            table: table,
                            values: model
                        }) + zn.sql.update({
                            table: table,
                            updates: 'zn_tree_son_count=zn_tree_son_count+1',
                            where: {
                                id: _pid
                            }
                        });
                    });
            },
            deleteNode: function (table, where){
                return zn.createTransactionBlock()
                    .query(zn.sql.select({
                        table: table,
                        fields: 'id, zn_tree_pid, zn_tree_order',
                        where: where
                    }))
                    .query('delete', function (sql, rows, fields, tran){
                        var _model = rows[0];
                        if(_model){
                            var _sql = 'delete from {0} where id={1};'.format(table, _model.id),
                                _pid = +_model.zn_tree_pid;

                            if(_pid){
                                _sql += 'update {0} set zn_tree_son_count=zn_tree_son_count-1 where id={1};'.format(table, _pid);
                            }
                            _sql += 'update {0} set zn_tree_order=zn_tree_order-1 where zn_tree_order>{1} and zn_tree_pid={2};'.format(table, _model.zn_tree_order, _pid);
                            _sql += "delete from {0} where locate(',{1},',zn_tree_parent_path)<>0;".format(table, _model.id);
                            return _sql;
                        } else {
                            return this.rollback('The node is not exist!'), false;
                        }
                    });
            },
            orderNode: function (table, id, order){
                return zn.createTransactionBlock()
                    .query('select {0} from {1} where id={2};select count(id) as count from {1} where zn_tree_pid=(select zn_tree_pid from {1} where id={2});'.format('id, zn_tree_pid, zn_tree_order', table, id))
                    .query('order', function (sql, rows, fields){
                        var _model = rows[0][0],
                            _count = rows[1][0].count;

                        if(_model){
                            var _treeOrder = +_model.zn_tree_order,
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

                            var _sql = 'update {0} set zn_tree_order={1} where zn_tree_order={2} and zn_tree_pid={3};'.format(table, _treeOrder, _newOrder, _model.zn_tree_pid);
                            _sql += 'update {0} set zn_tree_order={1} where id={2};'.format(table, _newOrder, _model.id);
                            return _sql;
                        } else {
                            return this.rollback('The node is not exist!'), false;
                        }
                    });
            }
        }
    });

});
