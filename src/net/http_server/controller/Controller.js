zn.define(function () {

    var Controller = zn.Class('Controller', {
        methods: {
            init: {
                auto: true,
                value: function (context, stores){
                    this._context = context;
                    this._stores = stores;
                    this._store = context._store;
                }
            },
            action: function (model, store){
                var _store = store || this._store;
                var _key = model;
                if(typeof model !== 'string'){
                    _key = model.getTable();
                }
                var _ctor = this._context._actions[_key];
                if(_ctor){
                    return new _ctor(_store, _ctor.getMeta('model'));
                }else {
                    throw new Error('arguments error: The action for ' + _key + ' is not exist!');
                }
            },
            store: function (name){
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
