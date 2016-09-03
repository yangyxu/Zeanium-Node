zn.define(function () {

    return zn.Controller('var',{
        properties: {

        },
        methods: {
            init: function (args){
                this._action = this.action('RightsVar');
            },
            getByPid: {
                method: 'GET/POST',
                argv: {
                    pid: null,
                    fields: 'id as value, title as text',
                    order: ''
                },
                value: function (request, response, chain){
                    this._action.select(request.getValue('fields'), 'pid='+request.getValue('pid'), request.getJSON('order')).then(function(data){
                        response.success(data);
                    });
                }
            }
        }
    });

});
