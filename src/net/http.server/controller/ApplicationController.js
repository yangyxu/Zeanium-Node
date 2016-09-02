zn.define(function () {

    return zn.Controller('', {
        methods: {
            initDataBase: {
                method: 'GET/POST',
                value: function (request, response, chain){
                    this.store().setup().then(function (data){
                        response.success(data);
                    }, function (error){
                        response.error(error);
                    });
                }
            },
            initModel: {
                method: 'GET/POST',
                argv: {
                    model: null
                },
                value: function (request, response, chain){
                    var _modelName = request.getValue('model');
                    var model = null,
                        models = this._context._models;
                    for(var key in models){
                        model = models[_modelName];
                        if(model){
                            var _table = model.getMeta('table');
                            if (_table&&!models[_table]){
                                this.store().createModel(model);
                                break;
                            }
                        }
                    }

                    response.success("init model [" + _modelName + "] successful!!!");
                }
            },
            setup: {
                method: 'GET/POST',
                value: function (request, response, chain){

                    var model = null,
                        models = this._context._models;
                    for(var key in models){
                        model = models[key];
                        var _table = model.getMeta('table');
                        if (_table&&!models[_table]){
                            this.store().createModel(model);
                        }
                    }

                    response.success("setup successful!!!");
                }
            },
            apis: {
                method: 'GET/POST',
                value: function (request, response, chain){
                    var _routers = this._context._routers,
                        _router = null,
                        _data = [],
                        _meta = {};
                    for(var key in _routers){
                        _router = _routers[key];
                        _meta = { router: key };
                        zn.extend(_meta, _router.handler.meta);
                        _data.push(_meta);
                    }
                    response.success(_data);
                }
            },
            plugins: {
                method: 'GET/POST',
                value: function (request, response, chain){
                    response.success(Object.keys(this._context._appContexts));
                }
            }
        }
    });

});
