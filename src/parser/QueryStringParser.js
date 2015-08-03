/**
 * Created by yangyxu on 8/1/15.
 */
zn.define([
    'node:querystring'
], function (querystring) {

    var QueryStringParser = zn.class('zn.parser.QueryStringParser', {
        methods: {
            init: function (maxKeys){
                this._maxKeys = maxKeys;
            },
            write: function (buffer){
                return this._buffer += buffer.toString('ascii'), this._buffer.length;
            },
            end: function (){
                this._fields = querystring.parse(this._buffer, '&', '=', {
                    maxKeys: this._maxKeys
                });
                this._maxKeys = null;
                this.super();
            }
        }
    });

    return QueryStringParser;

});