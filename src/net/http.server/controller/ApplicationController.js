zn.define(function () {

    return zn.Controller('', {
        methods: {
            setup: {
                method: 'GET/POST',
                value: function (request, response, $data, $post, $get, $files){

                    var model = null,
                        models = this._context._models;
                    for(var key in models){
                        model = models[key];
                        var _table = model.getMeta('table');
                        if (_table&&!models[_table]){
                            this.store().createModel(model);
                        }
                    }

                    response.success("setup success!!!");
                }
            },
            apis: {
                method: 'GET/POST',
                value: function (request, response, $data, $post, $get, $files){
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
                value: function (request, response, $data, $post, $get, $files){
                    response.success(Object.keys(this._context._appContexts));
                }
            }
        }
    });

});
