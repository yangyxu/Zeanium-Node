/**
 * Created by yangyxu on 9/17/14.
 */
zn.define(function () {

    return zn.collection('zn.db.common.collection.DB', {
        methods: {
            init: function (){
                this.super(Store.getStore({
                    host: '127.0.0.1',
                    user: 'root',
                    password: '123456',
                    port: 3306
                }));
            },
            create: function (name){
                return this._store.execCommand('CREATE DATABASE ' + name);
            },
            drop: function (){
                return this._store.execCommand('DROP DATABASE ' + name);
            },
            show: function (){
                return this._store.execCommand('SHOW DATABASES;');
            }
        }
    });

});
