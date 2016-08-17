zn.define(function () {

    return zn.Controller('model',{
        properties: {

        },
        methods: {
            init: function (args){

            },
            getAllModels: {
                method: 'GET/POST',
                value: function (request, response, chain){
                    var _appName = request.getValue('appName'),
                        _apps = request.context._apps,
                        _models = [];

                    if(_appName){
                        if(_apps[_appName]){
                            _apps = [_apps[_appName]];
                        }else {
                            _apps = [];
                        }
                    }

                    zn.each(_apps, function (app){
                        zn.each(app.getModels(), function (model, index){
                            _models.push({
                                name: index,
                                isTreeModel: !!model.getPropertie('pid'),
                                table: model.getTable(),
                                props: model.getMeta('properties')
                            });
                        });
                    });

                    response.success(_models);
                }
            },
            getModelProps: {
                method: 'GET/POST',
                argv: {
                    model: null
                },
                value: function (request, response, chain){
                    var _model = request.getValue('model'),
                        _apps = request.context._apps

                    zn.each(_apps, function (app){
                        zn.each(app.getModels(), function (model, index){
                            if(_model == index || _model == model.getTable()){
                                var _props = model.getMeta('properties'),
                                    _temp = [
                                        { type: 'text', name: 'title', title: 'title' }
                                    ],
                                    _prop = null;

                                for(var key in _props){
                                    _prop = _props[key];
                                    _prop.name = key;
                                    //var _type = _prop.type;
                                    //_prop.dataType = _type;
                                    _prop.title = key;
                                    _prop.type = 'text';
                                    _temp.push(_prop);
                                }
                                response.success(_temp);
                                return -1;
                            }
                        });
                    });
                }
            },
            __getModelAction: function (request, name){
                var _apps = request.context._apps,
                    _app = null,
                    _actions = {},
                    _action = null;
                for(var key in _apps){
                    _app = _apps[key];
                    _actions = _app.getActions();
                    for(var _key in _actions){
                        if(_key==name){
                            _action = _actions[_key];
                            return new _action(this._store, _action.getMeta('model'));
                        }
                    }
                }
            },
            getActionByName: {
                method: 'GET/POST',
                value: function (request, response, chain){
                    var _action = this.__getModelAction(request, request.getValue('name'));
                    console.log(_action);

                    response.success('xxx');
                }
            },
            select: {
                method: 'GET/POST',
                argv: {
                    model: null,
                    fields: '*',
                    where: '',
                    order: ''
                },
                value: function (request, response, chain){
                    var _action = this.__getModelAction(request, request.getValue('model'));
                    if(_action){
                        _action.select(request.getValue('fields'), request.getJSON('where'), request.getJSON('order')).then(function(data){
                            response.success(data);
                        });
                    }else {
                        response.error('Model is not exist!');
                    }
                }
            },
            paging: {
                method: 'GET/POST',
                argv: {
                    model: null,
                    fields: '*',
                    where: '',
                    order: '',
                    pageIndex: 1,
                    pageSize: 10
                },
                value: function (request, response, chain){
                    var _action = this.__getModelAction(request, request.getValue('model'));
                    if(_action){
                        console.log(request.session.user);
                        _action.paging(request.getValue('fields'), request.getJSON('where'), request.getJSON('order'), request.getInt('pageIndex'), request.getInt('pageSize')).then(function(data){
                            response.success(data);
                        });
                    }else {
                        response.error('Model is not exist!');
                    }
                }
            },
            addNode: {
                method: 'GET/POST',
                argv: {
                    model: null,
                    data: null
                },
                value: function (request, response, chain){
                    var _action = this.__getModelAction(request, request.getValue('model'));
                    if(_action){
                        _action.addNode(request.getJSON('data')).then(function (data){
                            _action = null;
                            response.success(data);
                        });
                    }else {
                        response.error('Model is not exist!');
                    }
                }
            },
            updateNode: {
                method: 'GET/POST',
                argv: {
                    model: null,
                    data: null
                },
                value: function (request, response, chain){
                    var _action = this.__getModelAction(request, request.getValue('model'));
                    if(_action){
                        _action.updateNode(request.getJSON('data')).then(function (data){
                            response.success(data);
                        });
                    }else {
                        response.error('Model is not exist!');
                    }
                }
            },
            deleteNode: {
                method: 'GET/POST',
                argv: {
                    model: null,
                    id: null
                },
                value: function (request, response, chain){
                    var _action = this.__getModelAction(request, request.getValue('model'));
                    if(_action){
                        _action.deleteNode({ id: request.getValue('id') }).then(function (){
                            response.success('删除成功');
                        });
                    }else {
                        response.error('Model is not exist!');
                    }
                }
            },
            deleteNodes: {
                method: 'GET/POST',
                argv: {
                    model: null,
                    ids: null
                },
                value: function (request, response, chain){
                    var _action = this.__getModelAction(request, request.getValue('model'));
                    if(_action){
                        _action.deleteNode('id in ('+request.getValue('ids')+')').then(function (){
                            response.success('删除成功');
                        });
                    }else {
                        response.error('Model is not exist!');
                    }
                }
            }
        }
    });
});
