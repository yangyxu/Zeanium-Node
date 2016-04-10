zn.define(function () {

    return zn.controller('_api',{
        properties: {

        },
        methods: {
            __list: function (request, response) {
                response.viewModel('_api', {
                    data: 'xxx'
                });
            }
        }
    });

});
