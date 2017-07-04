/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    './Transaction',
], function (Transaction) {

    return zn.Class({
        statics: {
            getPool: function (config){
                switch (config.type.toLowerCase()) {
                    case 'mysql':
                        return new zn.db.schema.MySqlConnectionPool(config);
                    case 'mongo':

                        break;
                }
            }
        },
        properties: {
            config: null,
            pool: null
        },
        methods: {
            init: function (config){
                this._config = config;
            },
            beginTransaction: function () {
                return (new Transaction(this._pool)).begin();
            },
            select: function (argv){
                return this.query(zn.sql.select(argv));
            },
            insert: function (argv){
                return this.query(zn.sql.insert(argv));
            },
            update: function (argv){
                return this.query(zn.sql.update(argv));
            },
            delete: function (argv){
                return this.query(zn.sql.delete(argv));
            },
            getConnection: function (){
                throw new Error("The ConnectionPool Class must implement getConnection method.");
            },
            getSqlSchema: function (){
                throw new Error('The ConnectionPool Class must be implement getSqlSchema method.');
            },
            query: function (){
                throw new Error('The ConnectionPool Class must be implement query method.');
            }
        }
    });

});
