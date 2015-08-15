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
                this._collection = this.store('local_mysql').getCollection(Role, UserCollection);
            },
            getAllUsers: {
                method: 'GET/POST',
                argv: {
                    pageIndex: 1,
                    pageSize: 10
                },
                value: function (request, response, $data, $post, $get, $files) {
                    var _self = this;

                    //console.log($files);

                    response.success($data);

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