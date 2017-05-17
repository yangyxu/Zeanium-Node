zn.define(function () {

    return zn.Controller('$', {
        methods: {
            init: function (serverContext){
                this._serverContext = serverContext;
            },
            redeploy: {
                method: 'GET/POST',
                value: function (request, response, chain){
                    this._serverContext.__delayDeploy();
                    response.success('redeploy success');
                }
            },
            apps: {
                method: 'GET/POST',
                value: function (request, response, chain){
                    response.success(Object.keys(this._serverContext._apps));
                }
            }
        }
    });

});
