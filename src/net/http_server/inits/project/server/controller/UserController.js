zn.define([
    '../model/User',
    '../collection/UserCollection'
],function (User, UserCollection) {

    var Store = zn.db.data.Store;

    return zn.controller('user',{
        properties: {

        },
        methods: {
            init: function (args){
                this._collection = this.store('mysql').getCollection(User, UserCollection);
            },
            findUser: {
                method: 'GET/POST',
                argv: {
                    userId: null
                },
                value: function (request, response, $data, $post, $get, $files){
                    this._collection.findOne({ id: $data.userId }).then(function (data){
                        if(!data){
                            response.error('query no data');
                        }else {
                            response.viewModel('user_info', { user: data });
                        }
                    });
                }
            },
            getAllUsers: {
                method: 'GET/POST',
                argv: {
                    pageIndex: 1,
                    pageSize: 10
                },
                value: function (request, response, $data, $post, $get, $files) {
                    response.success([
                        {
                            name: 'yangyxu',
                            email: 'yangyxu@cisco.com',
                            age: 26
                        },
                        {

                        }
                    ]);
                }
            }
        }
    });

});
