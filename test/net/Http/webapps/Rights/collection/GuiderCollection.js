zn.define([
    'db',
    '../model/Guider'
], function (db, Guider) {

    return zn.class("GuiderCollection", db.data.Collection, {
        methods: {
            init: function (inStore, inModel){
                this.base(inStore, inModel);
                this._model = Guider;
            },
            register: function (username, pwd, email){
                return this.add({
                    username: username,
                    pwd: pwd,
                    email: email
                });
            },
            login: function (username, pwd){
                var _defer = zn.async.defer(), _self = this;
                try{
                    var _table = this._model.__getTable();
                    var _fields = this._model.__getFields(false);
                    var _connection = this._store.getConnection();
                    var _result = _connection.command
                        .select(_fields)
                        .from(_table)
                        .where({'username':username, 'pwd': pwd}).orWhere({'email':username, 'pwd': pwd})
                        .query()
                        .then(function (data){
                            _defer.resolve(data.rows[0]);
                            return _connection.command.update(_table)
                                .setValue({lastLoginTime:'now()'})
                                .where({id: data.rows[0].id})
                                .query();
                        }).catch(function (e){
                            throw new Error(e.message);
                        }).finally(function (){
                            _connection.close();
                        });
                }catch(e){
                    throw new Error(e.message);
                }
                return _defer.promise;
            },
            logout: function (){

            }
        }
    })
})