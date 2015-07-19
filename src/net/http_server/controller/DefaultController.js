zn.define(function () {

    return zn.controller('_default',{
        properties: {
            
        },
        methods: {
            __index: function (request, response) {
                response.writeEnd("Server Index Page");
            }
        }
    });

});