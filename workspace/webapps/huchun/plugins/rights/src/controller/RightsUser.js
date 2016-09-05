zn.define(['node:chinese-to-pinyin'],function (pinyin) {

    return zn.Controller('user',{
        properties: {

        },
        methods: {
            init: function (args){
                this._action = this.action('RightsUser');
            },
            logout: {
                method: 'GET/POST',
                value: function (request, response, chain){

                }
            },
            login: {
                method: 'GET/POST',
                argv: {
                    name: null,
                    pwd: null
                },
                value: function (request, response, chain){
                    this._action.selectOne(request.getValue()).then(function (user){
                        if(user){
                            /*
                            console.log(new Date().toDateString());
                            this._action.update({ lastLoginTime: new Date().toDateString()}, { id: user.id }).then(function (data){
                                console.log(data);
                            }, function (){
                                console.log(data);
                            });*/
                            //user['@session'] = request.session.serialize();
                            request.session.setItem('@AdminUser', user);
                            response.success(user);
                        } else {
                            response.error('用户名或密码不对');
                        }
                    }, function (error){
                        response.error(error.message);
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
                    });
                }
            }
        }
    });

});
