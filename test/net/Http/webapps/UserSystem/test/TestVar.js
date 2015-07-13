zn.define([
    'db',
    '../model/Var',
    '../collection/VarCollection',
    '../web_config'
],function (db, Var, VarCollection, web_config) {

    return zn.class('TestVar', {
        properties: {
            
        },
        methods: {
            init: function (){
                var _store = db.data.Store.getStore(web_config.mysql);
                this._collection = _store.getCollection(Var, VarCollection);
            },
            getVars: function () {

                return this._collection
                    .getVars(1)
                    .then(function (vars){
                        console.log(vars);
                    });
            }
        }
    });

});