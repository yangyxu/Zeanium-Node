/**
 * Created by yangyxu on 8/20/14.
 */
zn.define(['./SchemaSqlParser'], function (SchemaSqlParser) {

    var __slice = Array.prototype.slice;
    var SQLS = {
        insert: "insert into {table} {values};",
        update: "update {table} set {updates} {where};",
        delete: "delete from {table} {where};",
        select : "select {fields} from {table} {where} {order} {group} {limit};",
        paging: "select {fields} from {table} {where} {order} {group} {limit};select count(*) as count from {table} {where};"
    }, SQLS_DEFAULT = {
        fields: '*'
    }, __getSessionId = function (){
        if(zn._request){
            return zn._request.getSessionValueByKey('id');
        }else if(zn._oldRequest) {
            return zn._oldRequest.getSessionValueByKey('id');
        }else {
            return 0;
        }
    };

    return zn.sql = zn.Class({
        static: true,
        methods: {
            rights: function (userId){
                return " (zn_rights_enabled = 0 or (zn_rights_enabled <> 0 and zn_plugin_admin_user_exist({0}, zn_rights_users, zn_rights_roles) <> 0)) ".format(userId || __getSessionId());
            },
            observeRights: function (userId){
                return " (zn_rights_enabled = 0 or (zn_rights_enabled <> 0 and zn_plugin_admin_user_exist({0}, zn_rights_observe_users, zn_rights_observe_roles) <> 0)) ".format(userId || __getSessionId());
            },
            paging: function (){
                return __slice.call(arguments).map(function (data){
                    var _index = data.pageIndex || 1,
                        _size = data.pageSize || 10,
                        _start = (_index - 1) * _size,
                        _end = _index * _size;

                    data.limit = [_start, _size];
                    return this.__format(SQLS.paging, data);
                }.bind(this)).join('');
            },
            select: function (){
                return this.format(SQLS.select, arguments);
            },
            insert: function (){
                return this.format(SQLS.insert, arguments);
            },
            update: function (){
                return this.format(SQLS.update, arguments);
            },
            delete: function (){
                return this.format(SQLS.delete, arguments);
            },
            format: function (sql, argv){
                var _argv = [];
                switch (zn.type(argv)) {
                    case 'array':
                        _argv = argv;
                        break;
                    case 'object':
                        return this.__format(sql, argv);
                    case 'arguments':
                        _argv = __slice.call(argv);
                        break;
                }

                return _argv.map(function (data){
                    return this.__format(sql, data);
                }.bind(this)).join('');
            },
            __format: function (sql, data){
                var _data = zn.overwrite({ }, data);
                _data.fields = _data.fields || '*';
                return sql.format(SchemaSqlParser.parse(_data)).replace(/\s+/g, ' ');
                //return sql.format(SchemaSqlParser.parse(data)).replace(/\s+/g, ' ').replace(/(^s*)|(s*$)/g, '');
            }
        }
    });

});
