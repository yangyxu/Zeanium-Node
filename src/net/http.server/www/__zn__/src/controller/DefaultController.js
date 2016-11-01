zn.define(function () {

    return zn.Controller('default',{
        methods: {
            index: function (request, response) {
                console.log('xxx');
                response.success('default index');
            }
        }
    });

});
