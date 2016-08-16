zn.define(function () {

    return zn.Controller('project',{
        properties: {

        },
        methods: {
            init: function (args){
                this._action = this.action('Project');
            },
            create: {
                method: 'GET/POST',
                argv: {

                },
                value: function (request, response, chain){
                    var _userId = request.session.user.id;
                    this._action.addNode(request.getValue()).then(function (info){
                        this._action.selectOne({id: info.insertId}).then(function (user){
                            response.success(user);
                        }, function (error){
                            response.error(error.message);
                        });
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
                    this._action.updateNode(request.getValue(), { id: request.getValue('userId') }).then(function (data){
                        response.success(data);
                    }.bind(this), function (error){
                        response.error(error.message);
                    });
                }
            }
        }
    });
});
