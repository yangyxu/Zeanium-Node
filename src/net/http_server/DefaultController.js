zn.define(function () {

    return zn.class('DefaultController',{
        controller:'_default',
        properties: {
            
        },
        methods: {
            __index: function (request, response) {
                response.writeEnd("Server Index Page");
            }
        }
    });

});