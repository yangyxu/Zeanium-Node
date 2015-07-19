zn.define([
    'node:fs',
    'db',
    '../web_config',
    './BaseModel'
], function (fs, db, web_config, BaseModel) {

    var store = db.data.Store.getStore(web_config.mysql);

    fs.readdir(__dirname, function(err, files){
        if(err){
            zn.error(err);
            return;
        }
        var _models = {};
        files.forEach(function(file){
            zn.load('./'+file.split('.').shift(), function (model){
                if(model.__base__==BaseModel){
                    var _table = model.getMeta('table');
                    if (_table&&!_models[_table]){
                        store.createCollection(model);
                        _models[_table] = _table;
                    }
                }
            });
        });
    });

});
