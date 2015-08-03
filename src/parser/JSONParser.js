/**
 * Created by yangyxu on 8/1/15.
 */
zn.define([
    'node:buffer'
], function (buffer) {

    var Buffer = buffer.Buffer;

    var JSONParser = zn.class('zn.parser.JSONParser', zn.parser.Parser, {
        methods: {
            init: function (args){
                this._data = new Buffer('');
                this._bytesWritten = 0;
            },
            initWithLength: function (length){
                this._data = new Buffer(length);
            },
            write: function (buffer){
                if (this._data.length >= this._bytesWritten + buffer.length) {
                    buffer.copy(this._data, this._bytesWritten);
                }
                else {
                    this._data = Buffer.concat([this._data, buffer]);
                }

                this._bytesWritten += buffer.length;

                return buffer.length;
            },
            end: function (){
                try {
                    this._fields = JSON.parse(this._data.toString('utf8'));
                    this._data = null;
                    this._bytesWritten = null;
                    this.super();
                }catch (e) {

                }
            }
        }
    });

    return JSONParser;

});