zn.define([
    '../model/Role',
    '../collection/UserCollection',
    '../web_config'
],function (Role, UserCollection, web_config) {

    var Store = zn.db.data.Store;

    return zn.controller('user',{
        properties: {
            
        },
        methods: {
            init: function (args){
                this.super(args);
                this._collection = this.getStore('local_mysql').getCollection(Role, UserCollection);
            },
            getAllUsers: {
                method: 'POST',
                argv: {
                    pageIndex: 1,
                    pageSize: 10
                },
                value: function (request, response, values) {
                    var _self = this;

                    response.error(values);

                    /*
                    this._collection.find().then(function (data){
                        if(!data){
                            response.error('query no data');
                        }else {
                            response.viewModel('user-list', { users: data }, response);
                            //response.success(data);
                        }
                    });*/

                }
            }
        }
    });

});