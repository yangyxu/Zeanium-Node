zn.define(['node:xlsx'], function (xlsx) {

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
            },
            uploadFiles: {
                method: 'POST',
                value: function (request, response, chain){
                    var _files = request.$files, _result = [];
                    zn.each(_files, function (file, key){
                        _result.push(request.uploadFile(file));
                    });

                    response.success(_result);
                }
            },
            importXlsx: {
                method: 'POST',
                argv: {
                    start: 1,
                    model: null,
                    fields: [],
                    vars: '{}'
                },
                value: function (request, response, chain){
                    var _files = request.$files,
                        _result = [],
                        _sqls = [],
                        _store = this.store(),
                        _start = request.getInt('start'),
                        _model = request.getValue('model'),
                        _fields = request.getValue('fields'),
                        _vars = JSON.parse(request.getValue('vars')||'{}'),
                        _len = _fields.split(',').length;

                    zn.each(_files, function (file, key){
                        var _file = request.uploadFile(file);
                        var _worksheet = xlsx.readFile(_file.path);
                        Object.keys(_worksheet.Sheets).map((name)=>{
                            var _data = xlsx.utils.sheet_to_json(_worksheet.Sheets[name], {
                                header: 1,
                                raw: true
                            });

                            if(_data.length){
                                zn.each(_data, function (item, index){
                                    if(index > (_start-1)){
                                        if(item.length){
                                            var _values = [],
                                                _value = null;
                                            for(var i=0; i<_len; i++){
                                                _value = item[i]||'';

                                                if(_vars[i]){
                                                    _value = _vars[i][_value];
                                                }

                                                if(!zn.is(_value, 'number')){
                                                    _value = "\'" + _value + "\'";
                                                }
                                                _values.push(_value);
                                            }
                                            _sqls.push("insert into {0} ({1}) values ({2})".format(_model, _fields, _values.join(',')));
                                        }
                                    }
                                });
                            }

                            _result.push({
                                title: name,
                                data: _data
                            });
                        });
                    });

                    _store.query(_sqls.join(';')).then(function (){
                        response.success(_result);
                    }, function (err){
                        response.error('Import Error: ' + err.message);
                    });
                }
            }
        }
    });

});
