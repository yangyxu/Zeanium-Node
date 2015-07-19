zn.define([
    'db',
    '../model/User',
    '../collection/UserCollection',
    '../web_config'
],function (db, User, UserCollection, web_config) {

    return zn.class('TestUser', {
        properties: {
            
        },
        methods: {
            init: function (){
                var _store = db.data.Store.getStore(web_config.mysql);
                this._collection = _store.getCollection(User, UserCollection);
            },
            register: function () {

                return this._collection.add({
                    username:'111',
                    pwd: '111',
                    email:'test@cisco.com'
                }).then(function (rows){
                    console.log('add success: '+rows.insertId);
                });


            },
            login: function () {

                return this._collection
                    .login('111', '111')
                    .then(function (user){
                        console.log(user);
                    });

            },
            save: function () {

                return this._collection
                    .save({
                        username:'111',
                        pwd:'111',
                        id:1
                    })
                    .then(function (info){
                        console.log('save');
                    });
            },
            getUserById: function () {

                return this._collection
                    .findOne({ id: 1 })
                    .then(function (user){
                        console.log(user);
                    });
            }
        }
    });

});