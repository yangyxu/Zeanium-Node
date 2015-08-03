/**
 * Created by yangyxu on 8/1/15.
 */
zn.define([
    'node:events',
    'node:util'
], function (events, util) {

    var EventEmitter = events.EventEmitter;

    var OctetParser = zn.class('zn.parser.OctetParser', {
        methods: {
            init: function (options){
                if(!(this instanceof OctetParser)) return new OctetParser(options);
                EventEmitter.call(this);
            },
            write: function (buffer){
                this.emit('data', buffer);
                return buffer.length;
            },
            end: function (){
                this.emit('end');
                this.fire('end');
            }
        }
    });

    util.inherits(OctetParser, EventEmitter);

    return OctetParser;

});