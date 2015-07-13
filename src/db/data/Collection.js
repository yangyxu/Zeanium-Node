/**
 * Created by yangyxu on 9/17/14.
 */
zn.define([
    '../connection/Connection',
    './Model'
],function (Connection, Model) {
    var Async = zn.async;

    return zn.class('Collection', {
        methods: {
            init: function (inStore, inModel){
                this._store = inStore;
                this._model = inModel||Model;
            },
            add: function (inModel){
                var _defer = Async.defer(), _self = this;
                inModel = this.__getModel(inModel);
                if(inModel instanceof this._model){
                    var _table = inModel.constructor.__getTable();
                    var _fieldsValues = inModel.__getInsertFieldsValues();
                    var _connection = this._store.getConnection();
                    var _result = _connection.command
                        .insert(_table)
                        .fields(_fieldsValues[0])
                        .values(_fieldsValues[1])
                        .query()
                        .then(function (data){
                            _defer.resolve(data.rows);
                        }).catch(function (e){
                            throw new Error(e.message);
                        }).finally(function (){
                            _connection.close();
                        });
                }else {
                    throw new Error('The type of input model is not db.data.Model.');
                }
                return _defer.promise;
            },
            find: function (inWhere, fields, inModelClass){
                var _defer = Async.defer(), _self = this;
                var _modelClass = inModelClass||this._model;
                if(true){
                    var _table = _modelClass.__getTable();
                    var _fields = fields||_modelClass.__getFields(false);
                    var _where = inWhere||{1:1};
                    switch(zn.type(_where)){
                        case 'number':
                            _where = {};
                            _where[_modelClass._primary] = inWhere;
                            break;
                    }
                    var _connection = this._store.getConnection();
                    var _result = _connection.command.select(_fields).from(_table);
                    _result = _result.where(_where);
                    _result.query()
                        .then(function (data){
                            _defer.resolve(data.rows||[]);
                        }).finally(function (){
                            _connection.close();
                        });
                }else {
                    throw new Error('The type of input model is not db.data.Model.');
                }
                return _defer.promise;
            },
            findOne: function (inWhere, fields, inModelClass){
                var _defer = Async.defer();
                this.find(inWhere, fields, inModelClass)
                    .then(function (rows){
                        _defer.resolve(rows[0]);
                    });
                return _defer.promise;
            },
            save: function (inModel){
                var _defer = Async.defer(), _self = this;
                inModel = this.__getModel(inModel);
                if(inModel instanceof this._model){
                    var _table = inModel.constructor.__getTable();
                    var _primary = inModel.constructor._primary;
                    var _where = {};
                    _where[_primary] = inModel.get(_primary);
                    var _updates = inModel.__getUpdateFieldsValues();
                    var _connection = this._store.getConnection();
                    var _result = _connection.command
                        .update(_table)
                        .setValue(_updates)
                        .where(_where)
                        .query()
                        .then(function (data){
                            _defer.resolve(data);
                        }).catch(function (e){
                            throw new Error(e.message);
                        }).finally(function (){
                            _connection.close();
                        });
                }else {
                    throw new Error('The type of input model is not db.data.Model.');
                }
                return _defer.promise;
            },
            update: function (inUpdates, inWhere){
                var _defer = Async.defer(), _self = this;
                try{
                    var _updates = inUpdates||{}, _where = inWhere||{};
                    var _table = this._model.__getTable();
                    var _connection = this._store.getConnection();
                    var _result = _connection.command
                        .update(_table)
                        .setValue(_updates)
                        .where(_where)
                        .query()
                        .then(function (data){
                            _defer.resolve(data);
                        }).catch(function (e){
                            throw new Error(e.message);
                        }).finally(function (){
                            _connection.close();
                        });
                }catch(e){
                    throw new Error(e.message);
                }
                return _defer.promise;
            },
            remove: function (inModel){
                var _defer = Async.defer(), _self = this;
                inModel = this.__getModel(inModel);
                if(inModel instanceof this._model){
                    var _table = inModel.constructor.__getTable();
                    var _primary = inModel.constructor._primary;
                    var _where = {};
                    _where[_primary] = inModel.get(_primary);
                    var _connection = this._store.getConnection();
                    var _result = _connection.command
                        .delete(_table)
                        .where(_where)
                        .query()
                        .then(function (data){
                            _defer.resolve(data);
                        }).finally(function (){
                            _connection.close();
                        });
                }else {
                    throw new Error('The type of input model is not db.data.Model.');
                }
                return _defer.promise;
            },
            removeBy: function (inWhere, inModelClass){
                var _defer = Async.defer(), _self = this;
                var _modelClass = inModelClass||this._model;
                if(true){
                    var _table = _modelClass.__getTable();
                    var _where = inWhere;
                    switch(zn.type(_where)){
                        case 'number':
                            _where = {};
                            _where[_modelClass._primary] = inWhere;
                            break;
                    }
                    var _connection = this._store.getConnection();
                    var _result = _connection.command
                        .delete(_table)
                        .where(_where)
                        .query()
                        .then(function (data){
                            _defer.resolve(data);
                        }).catch(function (e){
                            _connection.close();
                        }).finally(function (){
                            _connection.close();
                        });
                }else {
                    throw new Error('The type of input model is not db.data.Model.');
                }
                return _defer.promise;
            },
            __getModel: function (inModel){
                if(Object.getPrototypeOf(inModel) === Object.prototype){
                    var _model = new this._model();
                    _model.sets(inModel);
                    inModel = _model;
                }
                return inModel;
            }
        }
    });

});