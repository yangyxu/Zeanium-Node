zn.define(function () {

    return zn.Controller('reader',{
        methods: {
            view: {
                method: 'GET/POST',
                argv: {
                    path: 'xx'
                },
                value: function (request, response, chain){
                    response.success('xxx');
                }
            },
            getFile: {
                method: 'GET/POST',
                argv: {
                    path: 'xx'
                },
                value: function (request, response, chain){
                    response.success('xxx');
                }
            }
        }
    });

});
