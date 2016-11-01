zn.define(function () {

    return zn.Controller('company',{
        properties: {

        },
        methods: {
            init: function (args){
                this._action = this.action('Company');
            },
            login: {
                method: 'GET/POST',
                argv: {
                    name: null,
                    password: null
                },
                value: function (request, response, chain){
                    this._action.selectOne(request.getValue()).then(function (item){
                        if(item){
                            request.session.setItem('@Merchant', item);
                            response.success(item);
                        } else {
                            response.error('商户名称或密码不对');
                        }
                    }, function (error){
                        response.error(error.message);
                    });
                }
            }
        }
    });
});
