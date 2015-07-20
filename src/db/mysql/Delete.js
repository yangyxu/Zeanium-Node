/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    './Schema',
    './Where'
],function (Schema, Where) {

    var _slice = Array.prototype.slice,
        _concat = Array.prototype.concat;

    return zn.class('Delete', Schema, {
        methods: {
            init: function (args, context){
                this._updates = [];
                this._where = Where.getInstance(null, context);
                this._order = [];
                this._group = [];
                this._limit = [];
                this.super(args, context);
            },
            from: function (from){
                switch (zn.type(from)){
                    case 'string':
                        this._table = from;
                        break;
                    case 'function':
                        this._table = '(' + (from.apply(this._context)||'') + ')';
                        break;
                }
                return this;
            },
            where: function(){
                return this._where.where.apply(this._where, arguments), this;
            },
            andWhere: function(){
                return this._where.andWhere.apply(this._where, arguments), this;
            },
            orWhere: function(){
                return this._where.orWhere.apply(this._where, arguments), this;
            },
            in: function(){
                return this._where.in.apply(this._where, arguments), this;
            },
            orIn: function(){
                return this._where.orIn.apply(this._where, arguments), this;
            },
            notIn: function(){
                return this._where.notIn.apply(this._where, arguments), this;
            },
            orNotIn: function(){
                return this._where.orNotIn.apply(this._where, arguments), this;
            },
            isNull: function (key) {
                return this._where.isNull(key), this;
            },
            orIsNull: function (key) {
                return this._where.orIsNull(key), this;
            },
            isNotNull: function (key) {
                return this._where.isNotNull(key), this;
            },
            orIsNotNull: function (key) {
                return this._where.orIsNotNull(key), this;
            },
            exists: function () {
                return this._where.exists.apply(this._where, arguments), this;
            },
            orExists: function () {
                return this._where.orExists.apply(this._where, arguments), this;
            },
            notExists: function () {
                return this._where.notExists.apply(this._where, arguments), this;
            },
            orNotExists: function () {
                return this._where.orNotExists.apply(this._where, arguments), this;
            },
            between: function () {
                return this._where.between.apply(this._where, arguments), this;
            },
            orBetween: function () {
                return this._where.orBetween.apply(this._where, arguments), this;
            },
            notBetween: function () {
                return this._where.notBetween.apply(this._where, arguments), this;
            },
            orNotBetween: function () {
                return this._where.orNotBetween.apply(this._where, arguments), this;
            },
            groupBy: function (){
                var _group = _slice.call(arguments);
                this._group = _concat(this._group, _group);
                return this;
            },
            having: function (){

            },
            orderBy: function (){
                var _order = _slice.call(arguments);
                var _self = this;
                if(zn.type(_order[0])==='string'){
                    _self._order.push(_order.join(' '));
                }else {
                    zn.each(_order[0], function(value, key){
                        _self._order.push(key+' '+value);
                    });
                }
                return this;
            },
            limit: function (){
                this._limit = _slice.call(arguments);
                return this;
            },
            build: function (){
                var _table = this._table;
                if(!_table||_table=='()'){
                    this.super('The query table is null');
                }
                var _where = this._where.build();
                _where = _where?' where '+_where:_where;
                var _group = this._group.join(',');
                _group = _group?' group by '+_group:_group;
                var _order = this._order.join(',');
                _order = _order?' order by '+_order:_order;
                var _limit = this._limit.length?(' limit ' + this._limit[0] + ',' + this._limit[1]):'';
                var _sql = 'delete from ' + _table + _where + _group + _order + _limit;
                return _sql;
            }
        }
    });

});