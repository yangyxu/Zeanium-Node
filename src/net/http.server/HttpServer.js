/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    './config/server',
    './HttpServerContext',
    'node:http'
],function (
    config,
    HttpServerContext,
    http
) {

    return zn.Class('HttpServer', {
        statics: {
            createServer: function (inArgs) {
                return new this(inArgs);
            }
        },
        events: ['request','connection','close'],
        properties: {
            context: null
        },
        methods: {
            init: function (args){
                var _config = zn.overwrite(args, config);
                this.__createHttpServer(_config.port, _config.host);
                this.__createHttpServerContext(_config);
            },
            __createHttpServer: function (port, host){
                var _httpServer = new http.Server();
                _httpServer.addListener('request', this.__onRequest.bind(this));
                _httpServer.addListener("connection", this.__onConnection.bind(this));
                _httpServer.addListener("close", this.__onClose.bind(this));
                _httpServer.listen(port, host);
                return _httpServer;
            },
            __createHttpServerContext: function (config){
                this._context = new HttpServerContext({
                    config: config,
                    webPath: process.cwd() + (config.catalog||''),
                    serverPath: __dirname
                });
            },
            __onRequest: function(request, response){
                try{
                    this.fire('request',request, response);
                    this._context.accept(request, response);
                } catch (e){
                    zn.error('HttpServer.js  Line - 61 ' + e.message);
                    console.log(e.stack);
                }
            },
            __onConnection: function (socket) {
                //zn.debug("NEW HTTP Connection[ idleStart ]: " + socket._idleStart);
            },
            __onClose: function(){
                this.fire('close', this);
                Logger.info("close zeanium-server");
            }
        }
    });

});
