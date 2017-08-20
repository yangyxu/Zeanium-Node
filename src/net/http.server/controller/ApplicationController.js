zn.define([
    'node:fs',
    'node:path',
    'node:child_process',
    '../service/ApplicationService.js'
], function (node_fs, node_path, node_child_process, ApplicationService) {

    return zn.Controller('', {
        methods: {
            init: function (){
                this._service = new ApplicationService();
            },
            setup: {
                method: 'GET/POST',
                value: function (request, response, chain){

                }
            },
            initDataBase: {
                method: 'GET/POST',
                value: function (request, response, chain){
                    this.store().createDataBase().then(function (data){
                        response.success(data);
                    }, function (error){
                        response.error(error);
                    });
                }
            },
            initModels: {
                method: 'GET/POST',
                value: function (request, response, chain){
                    this.store().createModels(this._context._models)
                        .then(function (data){
                            response.success(data);
                        }, function (err){
                            response.error(err);
                        });
                }
            },
            initData: {
                method: 'GET/POST',
                value: function (request, response, chain){
                    var _basePath = response._applicationContext._APP_PATH,
                        _dataPath = node_path.join(_basePath, 'src', 'data'),
                        _store = this.store(),
                        _self = this;
                    if(node_fs.existsSync(_dataPath)){
                        var _fns = [],
                            _sql = '',
                            _data = {},
                            _file = null,
                            _content = null;
                        node_fs.readdirSync(_dataPath).forEach(function (file){
                            _content = node_fs.readFileSync(node_path.join(_dataPath, file), 'utf-8');
                            _file = node_path.parse(node_path.join(_dataPath, file));
                            switch (_file.ext.toLowerCase()) {
                                case '.sql':
                                    if(file.indexOf('fn')!=-1){
                                        _fns = _fns.concat(_content.split('----'));
                                    }else {
                                        _sql += _content;
                                    }
                                    break;
                                case '.json':
                                    _data[_file.name] = JSON.parse(_content);
                                    break;
                            }
                        });
                        var _tran = _store.beginTransaction(),
                            _dataSql = this._service.parseJsonData(_data);
                        _fns.length && _fns.forEach(function (fn_sql){
                            fn_sql && _tran.query(fn_sql);
                        });
                        _sql && _tran.query(_sql);
                        _dataSql.length && _tran.query(_dataSql.join(''));
                        _tran.on('error', function (sender, err){
                            response.error(err);
                        }).on('finally', function (sender, data){
                            response.success(data);
                        }).commit();
                    }else {
                        response.error('不存在 ./src/data 路径');
                    }
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
                                response.success("init model [" + _modelName + "] successful!!!");
                                return ;
                            }
                        }
                    }

                    response.error("model [" + _modelName + "] is not exist!");
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
            routers: {
                method: 'GET/POST',
                value: function (request, response, chain){
                    response.success(Object.keys(request._context._routers));
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
            }
        }
    });

});
