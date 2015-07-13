/**
 * Created by yangyxu on 8/20/14.
 */
line.module([
    './Select',
    './Insert',
    './Update',
    './Delete',
    '../../util/Async',
    '../../util/Logger'
],function (Select, Insert, Update, Delete, Async, Logger) {

    return line.define('MySqlCommand', {
        properties: {
            connection: null
        },
        methods: {
            init: function (inArgs){
                this.sets(inArgs);
            },
            select: function (){
                return Select.getInstance(null, this).fields(Array.prototype.slice.call(arguments));
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
            query: function (queryString) {
                var _defer = Async.defer();
                Logger.debug(queryString);
                this.get('connection').query(queryString, function(err, rows, fields) {
                    if (err){
                        Logger.error(err.message);
                        _defer.reject(err);
                        Async.catch(err);
                    }else {
                        _defer.resolve({rows: rows, fields: fields});
                    }
                });
                return _defer.promise;
            }
        }
    });

});