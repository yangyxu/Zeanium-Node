zn.define([
    'node:fs'
], function (node_fs) {

    var SQL_TEMPLATE = "insert into {0} ({1}) values ({2});";

    return zn.Class({
        methods: {
            parseJsonData: function (data){
                var _data = [];
                for(var key in data){
                    _data = _data.concat(this.__getDataSql(key, data[key]));
                }

                return _data;
            },
            __getDataSql: function (table, data){
                var _sqls = [],
                    _keys = [],
                    _values = [],
                    _dnode = {
                        zn_tree_depth: 1,
                        zn_tree_order: 1,
                        zn_tree_son_count: 0,
                        zn_tree_parent_path: ','
                    },
                    _pnode = null;
                data.forEach(function (item, index){
                    if(item.zn_tree_pid){
                        _pnode = zn.overwrite(data[item.zn_tree_pid-1], _dnode);
                        _pnode.zn_tree_son_count = _pnode.zn_tree_son_count + 1;
                        item.zn_tree_order = _pnode.zn_tree_son_count;
                        item.zn_tree_depth = _pnode.zn_tree_depth + 1;
                        item.zn_tree_parent_path = _pnode.zn_tree_parent_path + item.zn_tree_pid + ',';
                    }
                });

                data.forEach(function (item){
                    _keys = [];
                    _values = [];
                    for(var key in item){
                        _keys.push(key);
                        _values.push(zn.is(item[key], 'string')?("'" +item[key]+ "'"):item[key]);
                    }
                    _sqls.push(SQL_TEMPLATE.format(table, _keys.join(','), _values.join(',')));
                });

                return _sqls;
            }
        }
    });

});
