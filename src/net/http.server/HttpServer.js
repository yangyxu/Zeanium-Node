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
                    if('OPTIONS' == request.method){
                        response.writeHead(200, {
                            'Access-Control-Allow-Origin': request.headers.origin,
                            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE, PUT',
                            'Access-Control-Allow-Headers': 'Accept,Accept-Charset,Accept-Encoding,Accept-Language,Connection,Content-Type,Cookie,DNT,Host,Keep-Alive,Origin,Referer,User-Agent,X-CSRF-Token,X-Requested-With',
                            "Access-Control-Allow-Credentials": true,
                            'Access-Control-Max-Age': '3600',//一个小时时间
                            'X-Powered-By': 'zeanium-node@1.2.0',
                            'Content-Type': 'text/html;charset=utf-8',
                            'Trailer': 'Content-MD5'
                        });
                        response.write('<a href="https://github.com/yangyxu/Zeanium-Node">zeanium-node@1.2.0</a>');
                        response.addTrailers({'Content-MD5': zn.uuid()});
                        response.end();
                    }else {
                        this._context.accept(request, response);
                    }
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
