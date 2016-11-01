/**
 * Created by yangyxu on 8/1/15.
 */
zn.define([
    'node:util',
    'node:path',
    'node:string_decoder',
    'node:events',
    'node:stream',
    'node:os',
    './File',
    './JSONParser',
    './OctetParser',
    './QueryStringParser',
    './MultipartParser'
], function (
    util,
    path,
    string_decoder,
    events,
    stream,
    os,
    File,
    JSONParser,
    OctetParser,
    QueryStringParser,
    MultipartParser) {

    var EventEmitter = events.EventEmitter,
        StringDecoder = string_decoder.StringDecoder,
        Stream = stream.Stream;

    var IncomingStream = zn.Class('zn.parser.IncomingStream', {
        properties: {

        },
        methods: {
            init: function (options){
                EventEmitter.call(this);

                this.sets(zn.extend(options||{}, {
                    maxFields: 1000,
                    maxFieldsSize: 2 * 1024 * 1024,
                    keepExtensions: false,
                    uploadDir: os.tmpDir(),
                    encoding: 'utf-8',
                    hash: false,
                    multiples: false
                }));

                this.error = null;
                this.ended = false;

                this.headers = null;
                this.type = null;

                this.bytesReceived = null;
                this.bytesExpected = null;
                this.openedFiles = [];

                this._parser = null;
                this._flushing = 0;
                this._fieldsSize = 0;

            },
            writeHeaders: function (headers){
                this.headers = headers;
                this._parseContentLength();
                this._parseContentType();
            },
            parse: function (req, callback){

            },
            open: function (){

            },
            write: function (buffer){

            },
            end: function (callback){

            },
            __maybeEnd: function (){

            }
        }
    });

    util.inherits(IncomingStream, EventEmitter);

    return IncomingStream;

});
