zn.define(function () {

    return zn.Controller('file',{
        properties: {

        },
        methods: {
            init: function (args){

            },
            upload: {
                method: 'GET/POST',
                argv: {
                    FORWORD_URL: ''
                },
                value: function (request, response, chain){
                    var _files = request.$files, _result = [];
                    zn.each(_files, function (file, key){
                        _result.push(key + '=' + request.uploadFile(file).url);
                    });
                    console.log(_result);
                    response.redirect(request.getValue('FORWORD_URL') + '?' + _result.join('&'));
                }
            }
        }
    });

});
