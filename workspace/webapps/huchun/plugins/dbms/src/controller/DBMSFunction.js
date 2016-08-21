zn.define(function () {

    return zn.Controller('function',{
        properties: {

        },
        methods: {
            init: function (args){
                this._action = this.action('DBMSFunction');
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
            getAllTables: function (request, response, chain){
                this._action.select().then(function (rows, fields, command){
                    response.success(rows);
                }, function (){

                });
            }
        }
    });
});
