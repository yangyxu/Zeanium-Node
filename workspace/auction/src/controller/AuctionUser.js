zn.define(function () {

    return zn.Controller('auction_user',{
        properties: {

        },
        methods: {
            init: function (args){

            },
            login: {
                method: 'POST',
                argv: {

                },
                value: function (request, response, chain){
                    response.success({
                        name: 'yangyxu',
                        pass: '1234'
                    });
                }
            }
        }
    });
});
