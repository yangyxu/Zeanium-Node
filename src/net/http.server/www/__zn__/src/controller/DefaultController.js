zn.define(function () {

    return zn.Controller('default',{
        methods: {
            index: function (request, response) {
                response.success('default index');
            }
        }
    });

});
