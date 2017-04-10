/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    './Select',
    './Insert',
    './Update',
    './Delete',
    './Paging'
],function (Select, Insert, Update, Delete, Paging) {

    var __slice = Array.prototype.slice;

    return zn.sql = zn.Class({
        static: true,
        methods: {
            paging: function (table, fields, where, order, pageIndex, pageSize){
                var _table = table,
                    _fields = fields,
                    _where = where,
                    _order = order,
                    _index = pageIndex || 1,
                    _size = pageSize || 5;
                if(arguments.length==1 && typeof(arguments[0])=='object'){
                    var _argv = arguments[0];
                    _table = _argv.table;
                    _fields = _argv.fields;
                    _where = _argv.where;
                    _order = _argv.order;
                    _index = _argv.pageIndex || _index;
                    _size = _argv.pageSize || _size;
                }

                var _start = (_index - 1) * _size,
                    _end = _index * _size;

                var _sql = zn.sql.select(_fields)
                            .from(_table)
                            .where(_where)
                            .limit(_start, _size)
                            .orderBy(_order)
                            .build() + ';';
                    _sql += zn.sql.select('count(*) as count')
                            .from(_table)
                            .where(_where)
                            .build() + ';';

                return _sql;
            },
            select: function (){
                return Select.getInstance(null, this).fields(__slice.call(arguments));
            },
            insert: function (table){
                return Insert.getInstance(null, this).into(table);
            },
            update: function (table){
                return Update.getInstance(null, this).table(table);
            },
            delete: function (table){
                return Delete.getInstance(null, this).from(table);
            },
            build: function (){
                var _argv = __slice.call(arguments);
                return _argv.shift().format(_argv)+';';
            }
        }
    });

});
