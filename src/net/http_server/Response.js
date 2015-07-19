/**
 * Created by yangyxu on 8/20/14.
 */
zn.define(function () {

    var CONTENT_TYPE = {
        DEFAULT: 'text/plain;charset=UTF-8',
        HTML:'text/html;charset=UTF-8',
        XML: 'text/xml;charset=UTF-8',
        JSON:'application/json;charset=UTF-8',
        JAVASCRIPT: 'text/javascript;charset=UTF-8'
    };

    var _slice = Array.prototype.slice;

    return zn.class('Response', {
        events: ['end'],
        properties: {
            request: null,
            contentType: null,
            serverResponse: null
        },
        methods: {
            init: function (request){
                this.set('request', request);
            },
            writeHead: function (httpState, inArgs){
                var _inArgs = inArgs||{};
                if(!_inArgs['Content-Type']){
                    _inArgs['Content-Type'] = this._contentType||this.__getContentType();
                }
                this.get('serverResponse').writeHead(httpState, _inArgs);
            },
            write: function(inData, inEncode){
                var _req = this.get('request');
                var _callback = _req.getValue('callback'),
                    _data = JSON.stringify(inData);

                if(_callback){
                    _data = _callback+'('+_data+')';
                    this._contentType = CONTENT_TYPE.JAVASCRIPT;
                }
                this.writeHead(200);
                this.get('serverResponse').write(_data, inEncode);
            },
            end: function (inData, inEncode) {
                this.get('serverResponse').end(inData, inEncode);
                this.fire('end', this);
            },
            writeEnd: function (inData, inEncode){
                this.write(inData, inEncode);
                this.end();
            },
            success: function (inData, inEncode){
                var _data = {
                    response: inData,
                    code: 1
                };
                this.__writeJson(_data, inEncode);
            },
            error: function (inData, inEncode){
                var _data = {
                    response: inData,
                    code: 0
                };
                this.__writeJson(_data, inEncode);
            },
            forword: function (url){
                var _sr = this.get('serverResponse');
                _sr.statusCode = 302;
                _sr.setHeader("Location", url);
                this.end();
            },
            __writeJson: function (inData, inEncode){
                inData.version = this.__getServerVersion();
                this._contentType = CONTENT_TYPE.JSON;
                this.writeEnd(inData, inEncode);
            },
            __getContentType: function (){
                return CONTENT_TYPE.DEFAULT;
            },
            __getServerVersion: function (){
                return 'v1.0.0';
            },
            __setResponse: function (response){
                this.serverResponse = response;
            }
        }
    });

});