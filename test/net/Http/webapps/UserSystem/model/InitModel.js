line.module([
    'node:fs',
    'util',
    'db',
    '../web_config',
    './BaseModel'
], function (fs, util, db, web_config, BaseModel) {

    var Logger = util.Logger;
    var store = db.data.Store.getStore(web_config.mysql);

    fs.readdir(__dirname, function(err, files){
        if(err){
            Logger.error(err);
            return;
        }
        var _models = {};
        files.forEach(function(file){
            line.load('./'+file.split('.').shift(), function (model){
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
