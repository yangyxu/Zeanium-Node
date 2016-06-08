zn.define(function () {

    return zn.Controller('api',{
        properties: {

        },
        methods: {
            list: function (request, response) {
                /*
                response.viewModel('_api', {
                    data: 'xxx'
                });*/

                //response.redirect('http://www.google.com.hk/');
                response.forword('/api/test');
            },
            test: function(request, response){
                response.success('list   >>>      test');
            }
        }
    });

});
