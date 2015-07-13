zn.define([
    'db',
    '../model/User',
    '../collection/UserCollection',
    '../web_config'
],function (db, User, UserCollection, web_config) {

    return zn.class({
        controller:'user',
        properties: {
            
        },
        methods: {
            init: function (){
                var _store = db.data.Store.getStore(web_config.mysql);
                this._collection = _store.getCollection(User, UserCollection);
            },
            getAllUsers: function (request, response) {
                var _args = {

                };

                request.checkArgs(_args, response);
                this._collection.find()
                    .then(function (data){
                        if(!data){
                            response.error('query no data');
                        }else {
                            response.success(data);
                        }
                    });
            },
            getUserById: function (request, response) {
                var _args = {
                    userId: ''
                };
                if(!request.checkArgs(_args, response)){ return ''; }
                var _userId = +request.getInt('userId');
                this._collection.findOne(_userId)
                    .then(function (data){
                        if(!data){
                            response.error('query no data');
                        }else {
                            response.success(data);
                        }
                    });
            },
            updateUserById: function (request, response){
                var _json = JSON.parse(request.getValue('json'));
                this._collection.update(_json, { id: _json.id })
                    .then(function (data){
                        if(+data.rows.affectedRows>0){
                            response.success('update success');
                        }else {
                            response.error('update error');
                        }
                    });
            },
            login: function (request, response){
                var _username = request.getValue('username');
                var _password = request.getValue('password');
                this._collection.login(_username, _password)
                    .then(function (user){
                        if(user){
                            response.error('login error');
                        }else {
                            response.success(user);
                        }
                    });
            },
            exist: function (request, response){
                var _username = request.getValue('username');
                this._collection.findOne({username:_username})
                    .then(function (data){
                        if(!data){
                            response.error('sorry, it has existed.');
                        }else {
                            response.success('ok, it is not exist.');
                        }
                    });
            },
            applyGuider: function (request, response){
                var _json = JSON.parse(request.getValue('json'));
                this._collection.add(_json)
                    .then(function (data){
                        if(+data.rows.insertId>0){
                            response.success('apply success');
                        }else {
                            response.error('apply fail');
                        }
                    });
            }
        }
    });

});