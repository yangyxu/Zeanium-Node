zn.define(function () {

    var process = require('child_process');

    return zn.Controller('$', {
        methods: {
            init: function (serverContext){
                this._serverContext = serverContext;
            },
            pull: {
                method: 'GET',
                value: function (request, response, chain){
                    process.exec('git pull', function (error, stdout, stderr) {
                        if (error !== null) {
                            response.error(error);
                        }else {
                            response.success(stdout);
                        }
                    });
                }
            },
            commit: {
                method: 'GET',
                value: function (request, response, chain){
                    var _commit = request.getValue('commit') || 'commit';
                    process.exec('git add *', function (error, stdout, stderr) {
                        if (error !== null) {
                            response.error(error);
                        }else {
                            process.exec('git commit -m "' + _commit + '"', function (error, stdout, stderr){
                                if (error !== null) {
                                    response.error(error);
                                }else {
                                    process.exec('git push', function (error, stdout, stderr){
                                        if (error !== null) {
                                            response.error(error);
                                        }else {
                                            response.success(stdout);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
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
