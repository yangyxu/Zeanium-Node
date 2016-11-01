/**
 * Created by yangyxu on 8/1/15.
 */
zn.define([
    'node:util',
    'node:fs',
    'node:events',
    'node:crypto'
], function (util, fs, events, crypto) {

    var WriteStream = fs.WriteStream,
        EventEmitter = events.EventEmitter;

    var File = zn.Class('zn.parser.File', {
        properties: {
            size: 0,
            path: null,
            name: null,
            type: null,
            hash: {
                set: function (value){
                    if(typeof value === 'string'){
                        this._hash = crypto.createHash(value);
                    }else {
                        this._hash = null;
                    }
                },
                get: function (){
                    return this._hash;
                }
            },
            lastModifiedDate: null
        },
        methods: {
            init: function (args){
                EventEmitter.call(this);
                this.sets(args);
                this._writeStream = null;
                if(typeof this.hash === 'string') {
                    this.hash = crypto.createHash(properties.hash);
                } else {
                    this.hash = null;
                }
            },
            open: function (){
                this._writeStream = new WriteStream(this.path);
            },
            toJSON: function (){
                return {
                    size: this.size,
                    path: this.path,
                    name: this.name,
                    type: this.type,
                    mtime: this.lastModifiedDate,
                    length: this.length,
                    filename: this.filename,
                    mime: this.mime
                };
            },
            write: function (buffer, callback){
                var _self = this;
                if (_self.hash) {
                    _self.hash.update(buffer);
                }
                this._writeStream.write(buffer, function() {
                    _self.lastModifiedDate = new Date();
                    _self.size += buffer.length;
                    _self.emit('progress', _self.size);
                    callback();
                });
            },
            end: function (callback){
                var _self = this;
                if (_self.hash) {
                    _self.hash = _self.hash.digest('hex');
                }
                this._writeStream.end(function() {
                    _self.emit('end');
                    callback();
                });
            }
        }
    });

    util.inherits(File, EventEmitter);

    return File;

});
