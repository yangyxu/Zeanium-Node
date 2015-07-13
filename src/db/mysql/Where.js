/**
 * Created by yangyxu on 8/20/14.
 */
zn.define(function () {

    return zn.class('Where', {
        statics: {
            getInstance: function (inArgs, context) {
                return new this(inArgs, context);
            }
        },
        methods: {
            init: function (args, context){
                this._context = context;
                this._where = [];
                this.sets(args);
            },
            build: function (){
                return this._where.join(' ');
            },
            where: function () {
                return this.andWhere.apply(this, arguments), this;
            },
            andWhere: function (){
                var _and = (this._where.length?'and ':'')+this.__toWhere.apply(this, arguments);
                return this._where.push(_and), this;
            },
            orWhere: function (){
                var _or = (this._where.length?'or ':'')+this.__toWhere.apply(this, arguments);
                return this._where.push(_or), this;
            },
            in: function (key, values) {
                return this.andWhere.apply(this, [key+' in '+this.__in(values)]), this;
            },
            orIn: function (key, values) {
                return this.orWhere.apply(this, [key+' in '+this.__in(values)]), this;
            },
            notIn: function (key, values) {
                return this.andWhere.apply(this, [key+' not in '+this.__in(values)]), this;
            },
            orNotIn: function (key, values) {
                return this.orWhere.apply(this, [key+' not in '+this.__in(values)]), this;
            },
            isNull: function (key) {
                return this.andWhere.apply(this, [key+' is null']), this;
            },
            orIsNull: function (key) {
                return this.orWhere.apply(this, [key+' is null']), this;
            },
            isNotNull: function (key) {
                return this.andWhere.apply(this, [key+' is not null']), this;
            },
            orIsNotNull: function (key) {
                return this.orWhere.apply(this, [key+' is not null']), this;
            },
            exists: function (){
                return this.andWhere.call(this, 'exists '+this.__in(arguments[0])), this;
            },
            orExists: function (){
                return this.orWhere.call(this, 'exists '+this.__in(arguments[0])), this;
            },
            notExists: function (){
                return this.andWhere.call(this, 'not exists '+this.__in(arguments[0])), this;
            },
            orNotExists: function (){
                return this.orWhere.call(this, 'not exists '+this.__in(arguments[0])), this;
            },
            between: function (){
                var _key = arguments[0], _val = arguments.length==3?[arguments[1], arguments[2]]:arguments[1];
                return this.andWhere.call(this, _key+' between ' + _val[0] + ' and '+_val[1]), this;
            },
            orBetween: function (){
                var _key = arguments[0], _val = arguments.length==3?[arguments[1], arguments[2]]:arguments[1];
                return this.orWhere.call(this, _key+' between ' + _val[0] + ' and '+_val[1]), this;
            },
            notBetween: function (){
                var _key = arguments[0], _val = arguments.length==3?[arguments[1], arguments[2]]:arguments[1];
                return this.andWhere.call(this, _key+' not between ' + _val[0] + ' and '+_val[1]), this;
            },
            orNotBetween: function (){
                var _key = arguments[0], _val = arguments.length==3?[arguments[1], arguments[2]]:arguments[1];
                return this.orWhere.call(this, _key+' not between ' + _val[0] + ' and '+_val[1]), this;
            },
            __push: function (){

            },
            __in: function(values){
                var _val = values||'0';
                switch (zn.type(values)){
                    case 'string':
                        break;
                    case 'array':
                        _val = _val.join(',')
                        break;
                    case 'function':
                        _val = _val.apply(this._context)||'0';
                        break;
                }
                return '('+_val+')';
            },
            __toWhere: function(){
                var _args = Array.prototype.slice.call(arguments);
                if (_args.length==1){
                    var _obj = _args[0];
                    switch (zn.type(_obj)){
                        case 'int':
                        case 'string':
                            return _obj;
                        case 'object':
                        case 'array':
                            return this.__dataToWhere(_obj);
                        case 'function':
                            return '('+_obj.apply(new this.constructor(null, this._context))+')';
                    }
                }else {
                    return this.__format(_args);
                }
            },
            __dataToWhere: function (data) {
                var _ands = [], _self = this;
                zn.each(data, function (value, key){
                    switch(zn.type(key)){
                        case 'number':

                            break;
                        case 'string':
                            _ands.push(_self.__format([key, value]));
                            break;
                    }
                });
                return '('+_ands.join(' and ')+')';
            },
            __format: function (args){
                var _args = args||[];
                if (_args.length==2){
                    _args.splice(1, 0, '=');
                }
                var _key = _args.shift(), _operate = _args.shift(), _val = _args[0];
                if(zn.type(_val)=='function'){
                    _val = '('+_val.apply(this._context)+')';
                }else {
                    switch (_operate.toLowerCase()){
                        case '=':
                            if(isNaN(_val)){
                                _val = "'"+_val+"'";
                            }
                            break;
                        case 'like':
                            _val = "'%"+_val+"%'";
                            break;
                        case 'in':
                        case 'not in':
                        case 'exists':
                        case 'not exists':
                            _val = this.__in(_val);
                            break;
                        case 'between':
                        case 'not between':
                            var _begin = _val, _end = _args[1];
                            if(zn.type(_val)){
                                _begin = _val[0];
                                _end = _val[1];
                            }
                            _val = _begin + ' and ' + _end;
                            break;
                    }
                }
                _operate = ' '+_operate+' ';
                return _key + _operate + _val;
            }
        }
    });

});