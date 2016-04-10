/**
 * Created by yangyxu on 9/17/14.
 */
zn.define(function () {

    return zn.collection('zn.db.common.action.DB', {
        methods: {
            init: function (dbconfig){
                this.super(Store.getStore(dbconfig));
            },
            create: function (name){
                return this._store.execCommand('CREATE DATABASE ' + name);
            },
            drop: function (){
                return this._store.execCommand('DROP DATABASE ' + name);
            },
            show: function (){
                return this._store.execCommand('SHOW DATABASES;');
            },
            use: function (db) {
                this._store.setDataBase(db);
            }
        }
    });

});
