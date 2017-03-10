/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    './Select',
    './Insert',
    './Update',
    './Delete'
],function (Select, Insert, Update, Delete) {

    var __slice = Array.prototype.slice;

    return zn.Class('MySqlCommand', {
        properties: {
            pool: null
        },
        methods: {
            init: function (pool){
                this._pool = pool;
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
                            .build()+';';

                return this.query(_sql);
            },
            query: function () {
                var _defer = zn.async.defer(),
                    _argv = __slice.call(arguments),
                    _query = _argv.shift().format(_argv),
                    _self = this,
                    _msg = '';

                zn.debug(_query);
                this._pool.getConnection(function (err, connection){
                    if(connection){
                        connection.query(_query, function(err, rows, fields) {
                            if (err){
                                _msg = 'MySql Connection query error: ' + err.message;
                                zn.error(_msg);
                                _defer.reject(err, _self);
                                zn.async.catch(err, _self);
                                if(zn._response){
                                    zn._response.error(_msg);
                                }
                            }else {
                                _defer.resolve(rows, fields, _self);
                            }
                            connection.release();
                        });
                    }else {
                        _msg = 'MySql Pool getConnection error: ' + JSON.stringify(err);
                        zn.error(_msg);
                        _defer.reject(err, _self);
                        if(zn._response){
                            zn._response.error(_msg);
                        }
                    }
                });

                return _defer.promise;
            }
        }
    });

});
