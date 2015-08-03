/**
 * Created by yangyxu on 8/1/15.
 */
zn.define(function () {

    var Parser = zn.class('zn.parser.Parser', {
        events: [ 'write', 'field', 'end'],
        methods: {
            init: function (){
                this._buffer = '';
                this._fields = {};
            },
            write: function (buffer){
                throw new Error('');
            },
            end: function (){
                zn.each(this._fields, function (value, key){
                    this.fire('field', key, value);
                }, this);
                this._buffer = '';
                this.fire('end');
            }
        }
    });

    return Parser;

});