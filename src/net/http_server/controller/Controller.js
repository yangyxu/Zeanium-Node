zn.define(function () {

    var BaseController = zn.class('BaseController', {
        properties: {
            config: null,
            stores: null
        },
        methods: {
            init: function (args){
                this.sets(args);
            },
            getStore: function (name){
                var _store = this.stores[name];
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