/**
 * Created by yangyxu on 9/17/14.
 */
zn.define(function () {

    var Action = zn.Class('zn.db.data.Action', {
        methods: {
            init: {
                auto: true,
                value: function (store, ModelClass){
                    this._store = store;
                    this._model = new ModelClass({});
                    this._ModelClass = ModelClass;
                    this._table = this._ModelClass.getTable();
                }
            },
            beginTransaction: function (){
                return this._store.beginTransaction();
            },
            insert: function (data){
                var _fieldsValues = this.fixModel(data).__getInsertFieldsValues();
                return this._store.command.insert(this._table)
                    .fields(_fieldsValues[0])
                    .values(_fieldsValues[1])
                    .query();
            },
            select: function (fields, inWhere){
                var _where = inWhere || {1:1};
                switch(zn.type(_where)){
                    case 'number':
                        _where = {};
                        _where[this._ModelClass._primary] = inWhere;
                        break;
                }

                return this._store.command
                    .select(fields || this._ModelClass.getFields(false))
                    .from(this._table)
                    .where(_where)
                    .query();
            },
            selectOne: function (inWhere, fields){
                var _defer = zn.async.defer();
                this.select(fields, inWhere)
                    .then(function (rows){
                        _defer.resolve(rows[0]);
                    });

                return _defer.promise;
            },
            paging: function (fields, where, order, pageIndex, pageSize){
                var _defer = zn.async.defer();
                var _index = pageIndex || 1,
                    _size = pageSize || 10,
                    _start = (_index - 1) * _size,
                    _end = _index * _size,
                    _fields = fields || this._ModelClass.getFields(false),
                    _table = this._table;
                var _sql = zn.sql.select(_fields)
                            .from(_table)
                            .where(where)
                            .limit(_start, _size)
                            .orderBy(order)
                            .build() + ';';
                    _sql += zn.sql.select('count(id) as count').from(_table).where(where).build();
                return this._store.command.query(_sql);
            },
            update: function (data, where){
                var _model = this.fixModel(data),
                    _primary = this._ModelClass._primary,
                    _where = where || { 1: 1 };

                if(_primary && _model.get(_primary)){
                    _where[_primary] = _model.get(_primary);
                }

                return this._store.command
                    .update(this._table)
                    .setValue(_model.__getUpdateFieldsValues())
                    .where(_where)
                    .query();
            },
            delete: function (where){
                return this._store.command
                    .delete(this._table)
                    .where(where||{1:1})
                    .query();
            },
            fixModel: function (data){
                if(Object.getPrototypeOf(data) === Object.prototype){
                    this._model.sets(data);
                    data = this._model;
                }
                if(data instanceof this._ModelClass){
                    return data;
                } else {
                    throw new Error('The type of input model is not db.data.Model.');
                }
            }
        }
    });

    zn.Action = function (){
        var _args = arguments;
        if(_args.length==1){
            return zn.Class(Action, _args[0]);
        } else {
            return zn.Class(_args[0], Action, _args[1]);
        }
    }

    return Action;

});
