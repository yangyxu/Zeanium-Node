zn.define([
    '../model/User',
    '../model/Region'
], function (User, Region) {

    return zn.collection("UserCollection", {
        methods: {
            init: function (inStore, inModel){
                this._model = User;
            },
            register: function (mobilePhone, email, pwd){
                var _defer = zn.async.defer(), _self = this;
                try{
                    var _table = this._model.__getTable();
                    var _fields = this._model.__getFields(false);
                    var _connection = this._store.getConnection();
                    var _result = _connection.command
                        .select(_fields)
                        .from(_table)
                        .where({
                            'mobilePhone': mobilePhone
                        }).orWhere({
                            'email':email
                        }).query()
                        .then(function (data){
                            var _user = data.rows[0];
                            if(!_user){
                                _connection.command.insert(_table)
                                    .fields([ 'mobilePhone','email','pwd' ])
                                    .values([ mobilePhone, email, pwd ])
                                    .query().then(function (data){
                                        _connection.command
                                            .select(_fields)
                                            .from(_table)
                                            .where({ 'id': data.rows.insertId })
                                            .query()
                                            .then(function (data){
                                                _defer.resolve(data.rows[0]);
                                            });
                                    });
                            }else {
                                _defer.resolve(_user);
                            }
                        }).catch(function (e){
                            throw new Error(e.message);
                        }).finally(function (){
                            _connection.close();
                        });
                }catch(e){
                    zn.error(e.message);
                    throw new Error(e.message);
                }

                return _defer.promise;
            },
            login: function (mobilePhone, email, pwd){
                var _defer = zn.async.defer(), _self = this;
                try{
                    var _table = this._model.__getTable();
                    var _fields = this._model.__getFields(false);
                    var _connection = this._store.getConnection();
                    var _result = _connection.command
                        .select(_fields)
                        .from(_table)
                        .where({
                            'mobilePhone': mobilePhone,
                            'pwd': pwd
                        }).orWhere({
                            'email':email,
                            'pwd': pwd
                        }).query()
                        .then(function (data){
                            var _user = data.rows[0];
                            if(_user){
                                _defer.resolve(_user);
                                _connection.command.update(_table)
                                    .setValue({lastLoginTime:'now()'})
                                    .where({ id: _user.id })
                                    .query();
                            }else {
                                _defer.reject('User is not exist.');
                            }
                        }).catch(function (e){
                            throw new Error(e.message);
                        }).finally(function (){
                            _connection.close();
                        });
                }catch(e){
                    zn.error(e.message);
                    throw new Error(e.message);
                }

                return _defer.promise;
            },
            getRegions: function (){
                var _defer = zn.async.defer(),
                    _self = this;

                try{
                    var _table = Region.__getTable();
                    var _fields = Region.__getFields(false);
                    var _connection = this._store.getConnection();
                    var _result = _connection.command
                        .select(_fields)
                        .from(_table)
                        .query()
                        .then(function (data){
                            _defer.resolve(data.rows);
                        }).catch(function (e){
                            throw new Error(e.message);
                        }).finally(function (){
                            _connection.close();
                        });
                }catch(e){
                    zn.error(e.message);
                    throw new Error(e.message);
                }

                return _defer.promise;
            },
            logout: function (userId){

            }
        }
    })
})