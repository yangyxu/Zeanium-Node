zn.define(function () {

    return zn.Controller('project',{
        validate: true,
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
                    var _userId = request.session.getItem('user').id;
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
            }
        }
    });
});
