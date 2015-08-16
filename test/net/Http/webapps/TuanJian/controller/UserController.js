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
                this._collection = this.store('local_mysql').getCollection(User, UserCollection);
            },
            login: {
                method: 'POST',
                argv: {
                    pwd: null
                },
                value: function (request, response, $data, $post, $get, $files) {
                    this._collection.login($data.mobilePhone, $data.email, $data.pwd).then(function (data){
                        if(!data){
                            response.error('Login Error: User is not exist.');
                        }else {
                            response.success(data);
                        }
                    });
                }
            },
            register: {
                method: 'POST',
                argv: {
                    pwd: null
                },
                value: function (request, response, $data, $post, $get, $files) {
                    this._collection.register($data.phone, $data.email, $data.pwd).then(function (data){
                        if(!data){
                            response.error('Register Error');
                        }else {
                            response.success(data);
                        }
                    });
                }
            },
            logout: {
                method: 'POST',
                argv: {
                    userId: null
                },
                value: function (request, response, $data, $post, $get, $files) {
                    this._collection.logout($data.userId).then(function (data){
                        if(!data){
                            response.error('query no data');
                        }else {
                            response.success(data);
                        }

                    });
                }
            },
            uploadPictures: {
                method: 'POST',
                argv: {
                    userId: null
                },
                value: function (request, response, $data, $post, $get, $files) {
                    var _files = request.uploadFiles($files);
                    this._collection.logout($data.userId).then(function (data){
                        if(!data){
                            response.error('query no data');
                        } else {
                            response.success(data);
                        }

                    });
                }
            },
            getRegions: {
                method: 'GET',
                value: function (request, response, $data, $post, $get, $files) {
                    this._collection.getRegions().then(function (data){
                        if(!data){
                            response.error('query no data');
                        } else {
                            response.success(data);
                        }

                    });
                }
            }
        }
    });

});