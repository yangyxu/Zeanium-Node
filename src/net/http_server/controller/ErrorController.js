zn.define(function () {

    return zn.controller('_error', {
        properties: {
            
        },
        methods: {
            __404: function (request, response) {
                response.writeEnd("404 Error: "+ request.getParameter("ERROR_MESSAGE"));
            },
            __method_not_allowed: function (request, response) {
                response.writeEnd("405 METHOD_NOT_ALLOWED: "+ request.getParameter("ERROR_MESSAGE"));
            }
        }
    });

});