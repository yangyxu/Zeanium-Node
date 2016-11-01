zn.define(function () {

    return zn.Controller('field',{
        properties: {

        },
        methods: {
            init: function (args){
                this._action = this.action('DBMSField');
            },
            create: {
                method: 'GET/POST',
                argv: {
                    name: null
                },
                value: function (request, response, chain){
                    this._action.insert({
                        name: request.getValue('name')
                    }).then(function (rows, fields, command){
                        response.success('add success');
                    });
                }
            },
            update: {
                method: 'GET/POST',
                argv: {
                    name: null
                },
                value: function (request, response, chain){
                    this._action.insert({
                        name: request.getValue('name')
                    }).then(function (rows, fields, command){
                        response.success('add success');
                    });
                }
            },
            getField: {
                method: 'GET/POST',
                argv: {
                    name: null
                },
                value: function (request, response, chain){
                    response.success(request.getValue('name'));
                }
            }
        }
    });
});
