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
                        depth: 1,
                        treeOrder: 1,
                        sons: 0,
                        parentPath: ','
                    },
                    _pnode = null;
                data.forEach(function (item, index){
                    if(item.pid){
                        _pnode = zn.overwrite(data[item.pid-1], _dnode);
                        _pnode.sons = _pnode.sons + 1;
                        item.treeOrder = _pnode.sons;
                        item.depth = _pnode.depth + 1;
                        item.parentPath = _pnode.parentPath + item.pid + ',';
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
