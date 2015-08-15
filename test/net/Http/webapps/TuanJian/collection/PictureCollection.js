zn.define([
    '../model/Picture'
], function (Picture) {

    var String = zn.format.String;

    return zn.collection("PictureCollection", {
        methods: {
            init: function (store, model){
                this._model = Picture;
            },
            addPictures: function (files, userId, regionName){
                var _defer = zn.async.defer(),
                    _self = this,
                    _model = this._model;

                try{
                    var _table = _model.__getTable();
                    var _connection = this._store.getConnection(), _sql = '';

                    zn.each(files, function (file){
                        var _fields = [],
                            _values = [];
                        file.userId = userId || 1;
                        file.regionName = regionName || '';
                        zn.each(file, function (value, key){
                            _fields.push(key);
                            _values.push("'"+value+"'");
                        });
                        _sql += String.formatString('insert into {0} ({1}) values ({2});', _table, _fields.join(','), _values.join(','));
                    });

                    var _result = _connection.command
                        .query(_sql)
                        .then(function (data){
                            _defer.resolve(data.rows[0]);
                        }).catch(function (e){
                            throw new Error(e.message);
                        }).finally(function (){
                            _connection.close();
                        });
                }catch(e){
                    zn.error(e.message);
                    throw new Error(e.message);
                }

                return _defer.promise;
            },
            getPicturesByUserId: function (userId){
                var _defer = zn.async.defer(),
                    _self = this,
                    _model = this._model;

                try{
                    var _table = _model.__getTable();
                    var _fields = _model.__getFields(false);
                    var _connection = this._store.getConnection();
                    var _result = _connection.command
                        .select(_fields)
                        .from(_table)
                        .where({ 'userId': userId })
                        .query()
                        .then(function (data){
                            _defer.resolve(data.rows);
                        }).catch(function (e){
                            throw new Error(e.message);
                        }).finally(function (){
                            _connection.close();
                        });
                }catch(e){
                    zn.error(e.message);
                    throw new Error(e.message);
                }

                return _defer.promise;
            }
        }
    })
})