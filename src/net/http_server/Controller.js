zn.define(function () {

    var BaseController = zn.class('BaseController', {
        methods: {
            init: {
                auto: true,
                value: function (config, stores){
                    this._config = config;
                    this._stores = stores;
                }
            },
            config: function (key){
                return key ? this._config[key]: this._config;
            },
            store: function (name){
                var _store = name ? this._stores[name]: this._stores;
                if(!_store){
                    throw new Error('The database '+name+' is not exist.');
                }

                return _store;
            }
        }
    });

    zn.controller = function (){
        var _args = arguments,
            _name = _args[0],
            _meta = _args[1];

        _meta.controller = _name;

        return zn.class(_name, BaseController, _meta);
    }

    return BaseController;

});