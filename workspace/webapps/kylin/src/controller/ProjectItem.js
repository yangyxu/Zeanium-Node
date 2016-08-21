zn.define(function () {

    return zn.Controller('projectitem',{
        properties: {

        },
        methods: {
            init: function (args){
                this._action = this.action('ProjectItem');
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
            getItem: {
                method: 'GET/POST',
                argv: {
                    itemId: null
                },
                value: function (request, response, chain){
                    this._action.select('*', {
                        id: request.getValue('itemId')
                    }).then(function (data){
                        response.success(data[0]);
                    }.bind(this), function (error){
                        response.error(error.message);
                    }.bind(this));
                }
            },
            getitems: {
                method: 'GET/POST',
                argv: {
                    userId: null,
                    status: 0
                },
                value: function (request, response, chain){
                    this._action.select('*', {
                        status: request.getValue('status')
                    }).then(function (data){
                        response.success(data);
                    }.bind(this), function (error){
                        response.error(error.message);
                    }.bind(this));
                }
            }
        }
    });
});
