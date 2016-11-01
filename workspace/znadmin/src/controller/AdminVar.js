zn.define(function () {

    return zn.Controller('var',{
        properties: {

        },
        methods: {
            init: function (args){
                this._action = this.action('AdminVar');
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
            },
            getByPids: {
                method: 'GET/POST',
                argv: {
                    pids: null,
                    fields: 'id as value, title as text',
                    order: ''
                },
                value: function (request, response, chain){
                    this._action.select(request.getValue('fields'), 'pid in (' + request.getValue('pids') + ')', request.getJSON('order')).then(function(data){
                        response.success(data);
                    });
                }
            }
        }
    });

});
