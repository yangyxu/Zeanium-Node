zn.define(function () {

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
                    username: null,
                    password: null
                },
                value: function (request, response, chain){
                    this._action.selectOne(request.getValue()).then(function (user){
                        if(user){
                            request.session.user = user;
                            response.success(user);
                        } else {
                            response.error('用户名或密码不对');
                        }
                    }, function (error){
                        response.error(error.message);
                    });
                }
            },
            addUser: {
                method: 'POST',
                argv: {

                },
                value: function (request, response, chain){

                    this._action.insert(request.getValue()).then(function (rows, fields, command){
                        response.error('add success');
                    });
                }
            },
            updateUser: {
                method: 'GET/POST',
                argv: {
                    data: null,
                    userId: null
                },
                value: function (request, response, chain){
                    this._action.update({ name: 'name_'+$data.userId, pwd: 'pwd_'+$data.userId }, { id: $data.userId }).then(function (a, b, c){
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
                    this._action.findOne({ id: $data.userId }).then(function (data){
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
