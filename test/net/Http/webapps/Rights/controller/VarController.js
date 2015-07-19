zn.define([
    'db',
    '../model/Var',
    '../collection/VarCollection',
    '../web_config'
],function (db, Var, VarCollection, web_config) {

    return zn.class({
        controller:'var',
        properties: {
            
        },
        methods: {
            init: function (){
                var _store = db.data.Store.getStore(web_config.mysql);
                this._collection = _store.getCollection(Var, VarCollection);
            },
            getVarById: function (request, response) {
                var _key = +request.getInt('key');
                this._collection.findOne(_key)
                    .then(function (data){
                        if(!data){
                            response.error('query no data');
                        }else {
                            response.success(data);
                        }
                    });
            },
            getVarByPid: function (request, response) {
                var _key = +request.getInt('key');
                this._collection.find({pid:_key},'id,nodeName')
                    .then(function (data){
                        if(!data){
                            response.error('query no data');
                        }else {
                            response.success(data);
                        }
                    });
            }
        }
    });

});