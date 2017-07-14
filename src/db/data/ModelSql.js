/**
 * Created by yangyxu on 9/17/14.
 */
zn.define(function () {

    return zn.Class('zn.db.data.Model', {
        partial: true,
        statics: {
            getValues: function (values){
                var _values = {},
                    _value = null;
                this.getProperties(function (prop, key, props){
                    if(prop.ignore){
                        return false;
                    }
                    _value = values[key];
                    if(_value == null){
                        _value = prop.get && prop.get.call(this, key, prop, props);
                    }
                    switch (prop.type[0].toLowerCase()) {
                        case 'int':
                        case 'float':
                            _value = +_value;
                            if(isNaN(_value)){
                                return -1;
                            }
                            break;
                        case 'datetime':
                            _value = _value.trim();
                            if(!_value){
                                return -1;
                            }
                            break;
                    }
                    if(_value != null) {
                        _values[key] = _value;
                    }
                }, this);
                console.log(_values);
                return _values;
            },
            getUpdates: function (updates){
                var _updates = {},
                    _value = null;
                this.getProperties(function (prop, key, props){
                    var _auto_update = prop.auto_update;
                    if(_auto_update){
                        if(typeof _auto_update == 'function'){
                            _auto_update = _auto_update.call(this, prop, key, props);
                        }
                        if(_auto_update!=null){
                            _updates[key] = _auto_update;
                        }
                    }else {
                        if(updates[key]!=null){
                            _updates[key] = updates[key];
                        }
                    }
                }, this);

                return _updates;
            },
            getSelectFields: function (inFields){
                var fields = inFields||[];
                var _props = this.getProperties();
                if(typeof fields == 'function'){
                    fields = fields.call(this);
                }
                if(fields){
                    if(typeof fields == 'string'){
                        fields = fields.split(',');
                    }
                }else {
                    fields = Object.keys(_props);
                }

                var _prop = null,
                    _fields = [],
                    _format = null,
                    _convert = null;
                zn.each(fields, function (field, index){
                    field = field.trim();
                    if((field).toString().indexOf(' as ')!=-1){
                        _fields.push(field);
                        return -1;
                    }
                    if(typeof index == 'string'){
                        _fields.push(field + ' as ' + index);
                    }else {
                        _prop = _props[field];
                        if(!_prop){
                            return -1;
                        }
                        _format = _prop.format;
                        _convert = _prop.convert;
                        if(_convert){
                            _fields.push(_convert.replace(/\{\}/g, field) + ' as ' + field + '_convert')
                        }
                        if(_format){
                            _fields.push(_format.replace(/\{\}/g, field) + ' as ' + field);
                        }else {
                            _fields.push(field);
                        }
                    }
                });

                return _fields.join(',');
            },
            getInsertSql: function (argv){
                argv.table = this.getMeta('table');
                argv.values = this.getValues(argv.values);
                return zn.sql.insert(argv);
            },
            getSelectSql: function (argv){
                argv.table = this.getMeta('table');
                if(typeof argv.fields == 'string' && argv.fields.indexOf(' as ')!=-1){

                }else {
                    argv.fields = this.getSelectFields(argv.fields);
                }

                return zn.sql.select(argv);
            },
            getDeleteSql: function (argv){
                argv.table = this.getMeta('table');
                return zn.sql.delete(argv);
            },
            getUpdateSql: function (argv){
                argv.table = this.getMeta('table');
                argv.updates = this.getUpdates(argv.updates);
                return zn.sql.update(argv);
            },
            getPagingSql: function (argv){
                argv.table = this.getMeta('table');
                argv.fields = this.getSelectFields(argv.fields);
                return zn.sql.paging(argv);
            }
        },
        methods: {

        }
    });
});
