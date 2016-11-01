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

    return zn.sql = zn.Class({
        static: true,
        methods: {
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
                return _argv.shift().format(_argv);
            }
        }
    });

});
