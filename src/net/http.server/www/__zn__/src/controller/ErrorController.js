zn.define([
    '../config/error_message',
], function (error_message) {

    return zn.Controller('error', {
        properties: {

        },
        methods: {
            __404: function (request, response) {
                var _error = error_message['404'];
                _error.detail = request.getErrorMessage()||'';
                response.viewModel('_error', _error);
            },
            __405: function (request, response) {
                var _error = error_message['405'];
                _error.detail = request.getErrorMessage()||'';
                response.viewModel('_error', _error);
            }
        }
    });

});
