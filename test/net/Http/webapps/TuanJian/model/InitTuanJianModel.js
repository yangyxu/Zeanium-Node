var zn = require('../../../../../../src/zn');

var _config =

zn.define([
    'node:fs',
    'db'
], function (fs, db) {

    var store = db.data.Store.getStore({
        type: 'mysql',
        host: '127.0.0.1',
        user: 'root',
        password: 'yangyxu',
        database:'tuanjian',
        port: 3306
    });
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
