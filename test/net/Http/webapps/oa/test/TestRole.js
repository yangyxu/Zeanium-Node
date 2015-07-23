zn.define([
    'db',
    '../model/Role',
    '../collection/RoleCollection',
    '../web_config'
],function (db, Role, RoleCollection, web_config) {

    //console.log(web_config);

    return zn.class('TestUser', {
        properties: {
            
        },
        methods: {
            init: function (){
                var _store = db.data.Store.getStore(web_config.databases['local_mysql']);
                this._collection = _store.getCollection(Role, RoleCollection);
            },
            /*
            addRoleNode: function () {

                return this._collection.addTreeModel({
                    title:'奥地利',
                    pid: 5
                }).then(function (rows){
                    zn.trace('add success: '+rows.insertId);
                });
            },

            deleteRoleNode: function () {

                return this._collection.deleteTreeModel(20).then(function (rows){
                    zn.trace('delete success...');
                });
            }*/
            orderRoleNode: function () {

                return this._collection.orderTreeModel(5, 'down').then(function (rows){
                    zn.trace('delete success...');
                });
            }
        }
    });

});