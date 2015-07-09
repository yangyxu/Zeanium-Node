/**
 * Created by yangyxu on 8/20/14.
 */
zn.module([
    './Date'
],function (Date) {

    var TYPES = ['INFO', 'DEBUG', 'WARNING', 'ERROR', 'TRACE', '', 'INIT'];
    var COLORS_VALUE = ['#100000', '#2125a0', '#a82c2c', '#c045b7', '1cb131', '', '#100000'];
    var COLORS = [38, 34, 35, 31, 32, 36, 33];
    var LEVELS = {
        INFO: 0,
        DEBUG: 1,
        WARNING: 2,
        ERROR: 3,
        TRACE: 4,
        INIT: 6
    };


    return zn.class('Logger', {
        static: true,
        properties: {

        },
        methods: {
            init: function (args){

            },
            info: function (obj) {
                this.__log(LEVELS.INFO, obj);
            },
            debug: function (obj) {
                this.__log(LEVELS.DEBUG, obj);
            },
            warn: function (obj) {
                this.__log(LEVELS.WARNING, obj);
            },
            trace: function (obj) {
                this.__log(LEVELS.TRACE, obj);
            },
            error: function (obj) {
                this.__log(LEVELS.ERROR, obj);
            },
            __getDateString: function (date) {
                return Date.asString(date||new Date());
            },
            __getPosition: function (){
                try {
                    throw new Error();
                } catch(e) {
                    var _pos = e.stack.split('\n')[4].replace(/\(/g, '').replace(/\)/g, '').split('/').pop();
                    return _pos;
                }
            },
            __formatLog4Server: function (log, color) {
                var _tag = '', _head = '', _foot = '';
                if (color) {
                    _head = '\x1B[';
                    _foot = '\x1B[0m';
                    _tag = COLORS[5]+'m';
                    color = COLORS[log.type]+'m';
                }
                return [
                    log.time, 
                    ' [', 
                    _head,
                    color,
                    TYPES[log.type],
                    _foot,
                    '] [',
                    _head,
                    _tag,
                    log.pos, 
                    _foot,
                    '] ',
                    log.message
                ].join('');
            },
            __formatLog4Client: function (log, color) {
                return [
                    '%c'+log.time,
                    ' [',
                    TYPES[log.type],
                    '] [',
                    log.pos,
                    '] ',
                    log.message
                ].join('');
            },
            __log: function (type, message) {
                var _log = {
                    type: type,
                    message: typeof message=='object'?JSON.stringify(message): message,
                    time: this.__getDateString(),
                    pos: this.__getPosition()
                };
                if (zn.GLOBAL.document){
                    console.log(this.__formatLog4Server(_log, true));
                }else {
                    console.log(this.__formatLog4Client(_log, true), 'color:'+COLORS_VALUE[type]);
                }
            }
        }
    });

});