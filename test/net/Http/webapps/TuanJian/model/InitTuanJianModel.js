var zn = require('../../../../../../src/zn');

zn.define([
    'node:fs',
    'db',
    '../web_config'
], function (fs, db, web_config) {

    var store = db.data.Store.getStore(web_config.databases['local_mysql']);
    fs.readdir(__dirname, function(err, files){
        if(err){
            zn.error(err);
            return;
        }
        var _models = {};
        files.forEach(function(file){
            zn.load(__dirname + '/' + file, function (model){
                if(model.getMeta){
                    var _table = model.getMeta('table');
                    if (_table&&!_models[_table]){
                        store.createCollection(model);
                        _models[_table] = _table;
                    }
                }
            });
        });
    });

}).exec();;
