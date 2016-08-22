zn.define(['node:chinese-to-pinyin'],function (pinyin) {

    return zn.Controller('kylinuser',{
        properties: {

        },
        methods: {
            init: function (args){
                this._action = this.action('KylinUser');
            },
            pinyin: function (request, response, chain){
                response.success(pinyin('徐洋洋-yangyxu', {filterChinese: true}));
            },
            logout: {
                validate: true,
                method: 'GET/POST',
                value: function (request, response, chain){
                    request.session.clear();
                    response.success('注销成功');
                }
            },
            login: {
                method: 'GET/POST',
                argv: {
                    email: null,
                    password: null
                },
                value: function (request, response, chain){
                    this._action.selectOne(request.getValue()).then(function (user){
                        if(user){
                            console.log(user);
                            request.session.setItem('user', user);
                            response.success(user);
                        } else {
                            response.error('用户名或密码不对');
                        }
                    }, function (error){
                        response.error(error.message);
                    });
                }
            },
            register: {
                method: 'GET/POST',
                argv: {
                    email: null,
                    password: null
                },
                value: function (request, response, chain){
                    this._action.selectOne({email: request.getValue('email')}).then(function (user){
                        if(user){
                            response.error('该邮箱已经注册过，请重新输入！');
                        } else {
                            this._action.addNode(request.getValue()).then(function (info){
                                this._action.selectOne({id: info.insertId}).then(function (user){
                                    request.session.setItem('user', user);
                                    response.success(user);
                                }, function (error){
                                    response.error(error.message);
                                });
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
                    response.success(request.session.getItem('user'));
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
