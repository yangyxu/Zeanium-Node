zn.define(['node:chinese-to-pinyin'],function (pinyin) {

    return zn.Controller('user',{
        properties: {

        },
        methods: {
            init: function (args){
                this._action = this.action('AdminUser');
            },
            logout: {
                method: 'GET/POST',
                value: function (request, response, chain){
                    var _user = request.session.getItem('@AdminUser');
                    this._store.command.query("insert into zn_admin_user_log (createTime, createPerson, userId, actionType) values (now(), " + _user.id + ", " + _user.id + ", 1);").then(function (){
                        request.session.clear();
                        request.success('注销成功');
                    });
                }
            },
            login: {
                method: 'GET/POST',
                argv: {
                    name: null,
                    password: null
                },
                value: function (request, response, chain){
                    this._action.selectOne(request.getValue()).then(function (user){
                        if(user){
                            request.session.setItem('@AdminUser', user);
                            response.success(user);
                            var _sql = 'update zn_admin_user set lastLoginTime=now() where id=' + user.id + ';';
                            _sql += "insert into zn_admin_user_log (createTime, createPerson, userId, actionType) values (now(), " + user.id + ", " + user.id + ", 0);"
                            this._store.command.query(_sql);
                        } else {
                            response.error('用户名或密码不对');
                        }
                    }.bind(this), function (err){
                        response.error(JSON.stringify(err));
                    });
                }
            },
            getSession: {
                method: 'GET',
                value: function (request, response, chain){
                    response.success(request.session.getItem('@AdminUser'));
                }
            },
            updateUser: {
                method: 'GET/POST',
                argv: {
                    data: null,
                    userId: null
                },
                value: function (request, response, chain){
                    this._action.update(request.getValue('data'), { id: request.getValue('userId') }).then(function (a, b, c){
                        response.success('update success');
                    }, function (err){
                        response.error(JSON.stringify(err));
                    });
                }
            },
            findUserById: {
                method: 'GET/POST',
                argv: {
                    userId: null
                },
                value: function (request, response, chain){
                    this._action.selectOne({ id: request.getValue('userId') }).then(function (data){
                        if(!data){
                            response.error('query no data');
                        }else {
                            response.success(data);
                        }
                    }, function (err){
                        response.error(err.message);
                    });
                }
            },
            getAllUsers: {
                method: 'GET/POST',
                value: function (request, response, chain) {
                    this._action.select().then(function (data){
                        if(!data){
                            response.error('query no data');
                        }else {
                            response.success(data);
                        }
                    }, function (err){
                        response.error(JSON.stringify(err));
                    });
                }
            }
        }
    });

});
