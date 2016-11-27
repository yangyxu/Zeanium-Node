/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    './Schema'
],function (Schema) {

    return zn.Class('Insert', Schema, {
        methods: {
            init: function (args, context){
                this._fields = [];
                this._values = [];
                this._as = null;
                this.super(args, context);
            },
            field: function (){
                var _len = arguments.length, _field = arguments[0];
                if (_len==2){
                    _field += ' as ' + arguments[1];
                }
                if (_field){
                    this._fields.push(_field);
                }
                return this;
            },
            fields: function () {
                var _args = Array.prototype.slice.call(arguments);
                if(_args.length==1){
                    var _fields = _args[0];
                    switch (zn.type(_fields)){
                        case 'string':
                            this._fields.push(_fields);
                            break;
                        case 'array':
                            this._fields = this._fields.concat(_fields);
                            break;
                    }
                }else {
                    this._fields = this._fields.concat(_args);
                }
                return this;
            },
            values: function (){
                var _args = Array.prototype.slice.call(arguments);
                if(_args.length==1){
                    this._values.push('('+this.__formatArray(_args[0]).join(',')+')');
                }else {
                    this._values.push('('+this.__formatArray(_args).join(',')+')');
                }
                return this;
            },
            __formatArray: function (ary){
                zn.each(ary, function (value, key){
                    switch(zn.type(value)){
                        case 'string':
                            if(value.indexOf('{') === 0 && value.indexOf('}') === (value.length-1)){
                                value = value.substring(1, value.length-1);
                            }else {
                                value = "'" + value + "'";
                            }
                            ary[key] = value;
                            break;
                        case 'object':

                            break;
                    }
                });
                return ary;
            },
            into: function (into){
                switch (zn.type(into)){
                    case 'string':
                        this._table = into;
                        break;
                    case 'function':
                        this._table = '(' + (into.apply(this._context)||'') + ')';
                        break;
                }
                return this;
            },
            as: function (alias){
                this._as = alias;
                return this;
            },
            build: function (){
                var _table = this._table;
                if(!_table||_table=='()'){
                    this.super('The query table is null');
                }
                if(!this._values.length){
                    this.super('The values is null');
                }
                var _fields = this._fields.join(',');
                _fields = _fields?' ('+_fields+')':'';
                var _values = this._values.join(',');
                var _sql = 'insert into '+ _table +_fields+' values '+_values;
                return _sql;
            }
        }
    });

});
