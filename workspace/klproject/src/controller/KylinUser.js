zn.define(function () {

    return zn.Controller('kylinuser',{
        properties: {

        },
        methods: {
            init: function (args){
                this._action = this.action('KylinUser');
            },
            logout: {
                method: 'GET/POST',
                value: function (request, response, chain){
                    request.session.clear();
                    response.success('注销成功');
                }
            },
            login: {
                method: 'GET/POST',
                argv: {
                    token: null,
                    password: null
                },
                value: function (request, response, chain){
                    this._store.command.query("select * from zn_kylin_user where (phone='{0}' or name='{0}' or email='{0}') and password='{1}'".format(request.getValue('token'),request.getValue('password'))).then(function (data){
                        var user = data[0];
                        if(user){
                            if(+user.status==32){
                                response.error('您账户已经被锁定, 请联系公司后勤人员！');
                            }else {
                                user.isAdmin = false;
                                user.password = null;
                                delete user.password;
                                request.session.setItem('@KylinUser', user);
                                response.success(user);
                            }
                        } else {
                            this._store.command.query("select * from zn_admin_user where (phone='{0}' or name='{0}' or email='{0}') and password='{1}'".format(request.getValue('token'),request.getValue('password'))).then(function(data){
                                if(data.length){
                                    var _user = data[0];
                                    _user.isAdmin = true;
                                    _user.password = null;
                                    delete _user.password;
                                    this._store.command.query("select * from zn_admin_menu where zn_user_exist(" + _user.id + ", users, roles)<>0 and url<>'';").then(function (menu){
                                        _user.menu = menu;
                                        request.session.setItem('@AdminUser', _user);
                                        response.success(_user);
                                    }, function (error){
                                        response.error(error.message);
                                    });
                                }else {
                                    response.error('用户名或密码不对');
                                }
                            }.bind(this), function (error){
                                response.error(error.message);
                            });
                        }
                    }.bind(this), function (error){
                        response.error(error.message);
                    });
                }
            },
            register: {
                method: 'GET/POST',
                argv: {
                    phone: null,
                    password: null
                },
                value: function (request, response, chain){
                    this._action.selectOne({phone: request.getValue('phone')}).then(function (user){
                        if(user){
                            response.error('该手机号已经注册过，请重新输入！');
                        } else {
                            this._action.addNode(zn.extend(request.getValue(), { status: 31 })).then(function (info){
                                response.success('恭喜您, 成为我们大家庭的一员哦！');
                            }.bind(this), function (error){
                                response.error(error.message);
                            });
                        }
                    }.bind(this), function (error){
                        response.error(error.message);
                    });
                }
            },
            getUser: {
                method: 'GET/POST',
                argv: {
                    userId: null
                },
                value: function (request, response, chain){
                    this._action.selectOne({id: request.getValue("userId")}).then(function (user){
                        if(user){
                            response.success(user);
                        } else {
                            response.error('未查到该用户信息');
                        }
                    }, function (error){
                        response.error(error.message);
                    });
                }
            },
            getSession: {
                validate: true,
                method: 'GET/POST',
                value: function (request, response, chain){
                    response.success(request.session);
                }
            },
            update: {
                method: 'GET/POST',
                argv: {
                    data: null,
                    userId: null
                },
                value: function (request, response, chain){
                    this._action.updateNode(request.getValue('data'), { id: request.getValue('userId') }).then(function (data){
                        response.success(data);
                    }.bind(this), function (error){
                        response.error(error.message);
                    });
                }
            },
            authenticate: {
                method: 'GET/POST',
                argv: {
                    userId: null,
                    roleId: null
                },
                value: function (request, response, chain){
                    //console.log();
                    response.success(request.session.getItem('user'));
                    /*
                    this._action.updateNode(request.getValue(), { id: request.getValue('userId') }).then(function (data){
                        response.success(data);
                    }.bind(this), function (error){
                        response.error(error.message);
                    });*/
                }
            }
        }
    });
});
