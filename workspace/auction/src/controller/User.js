zn.define(function () {

    return zn.Controller('user',{
        properties: {

        },
        methods: {
            init: function (args){

            },
            register: {
                method: 'GET/POST',
                argv: {
                    name: null,
                    password: null
                },
                value: function (request, response, chain){

                }
            },
            login: {
                method: 'POST/GET',
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
