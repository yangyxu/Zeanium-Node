zn.define([
    '../model/User',
    '../collection/UserCollection',
    '../web_config'
],function (User, UserCollection, web_config) {

    var Store = zn.db.data.Store;

    return zn.controller('user',{
        properties: {
            
        },
        methods: {
            init: function (args){
                this.super(args);
                this._collection = this.getStore('local_mysql').getCollection(User, UserCollection);
            },
            getAllUsers: {
                method: 'GET/POST',
                argv: {
                    pageIndex: 1,
                    pageSize: 10
                },
                value: function (request, response, values) {
                    var _self = this;
                    this._collection.find().then(function (data){
                        if(!data){
                            response.error('query no data');
                        }else {
                            response.viewModel('user-list', { users: data }, response);
                            //response.success(data);
                        }
                    });

                }
            }
        }
    });

});