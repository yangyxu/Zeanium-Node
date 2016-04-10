zn.define(function () {

    return zn.controller('_default',{
        properties: {

        },
        methods: {
            __index: function (request, response) {
                response.viewModel('_index', {});
            }
        }
    });

});
