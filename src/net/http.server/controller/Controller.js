zn.define(function () {

    var Controller = zn.Class({
        methods: {
            init: {
                router: null,
                auto: true,
                value: function (context, stores){
                    this._context = context;
                    this._stores = stores;
                    this._store = context._store;
                    this._collections = {};
                }
            },
            collection: {
                router: null,
                value: function (model){
                    if(this._collections[model]){
                        return this._collections[model];
                    }else {
                        var _ctor = this._context.parentContext._collections[model];
                        if(_ctor){
                            this._collections[model] = new _ctor(this._store, _ctor.getMeta('model'));
                            return this._collections[model];
                        }else {
                            throw new Error('Arguments Error: The collection for ' + model + ' is not exist!');
                        }
                    }
                }
            },
            beginTransaction: {
                router: null,
                value: function (model, store){
                    return this._store.beginTransaction();
                }
            },
            query: {
                router: null,
                value: function (){
                    return this._store.query.call(this, arguments);
                }
            },
            store: {
                router: null,
                value: function (name){
                    if(!name && this._store){
                        return this._store;
                    }
                    var _store = name ? this._stores[name]: this._stores;
                    if(!_store){
                        throw new Error('The database '+name+' is not exist.');
                    }

                    return _store;
                }
            }
        }
    });

    zn.Controller = function (){
        var _args = arguments,
            _name = _args[0],
            _meta = _args[1];

        _meta.controller = _name;

        return zn.Class(_name, Controller, _meta);
    }

    return Controller;

});
