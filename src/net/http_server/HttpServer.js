/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    './config/server',
    './RequestAcceptor',
    'node:http',
    'node:url',
],function (config, RequestAcceptor, http, url) {

    return zn.class('HttpServer', {
        statics: {
            createServer: function (inArgs) {
                return new this(inArgs);
            }
        },
        events: ['request','connection','close'],
        properties: {
            config: {}
        },
        methods: {
            init: function (args){
                var _config = zn.overwrite(args, config);
                RequestAcceptor.initHandlerManager(_config);
                this.config = _config;
                this.__createServer(_config);
                this.__initRequestHandlers(_config);
            },
            __createServer: function (config){
                var _httpServer = new http.Server();
                _httpServer.addListener('request', this.__onRequest.bind(this));
                _httpServer.addListener("connection", this.__onConnection.bind(this));
                _httpServer.addListener("close", this.__onClose.bind(this));
                _httpServer.listen(config.port, config.host);

                return _httpServer;
            },
            __initRequestHandlers: function (config){
                //console.log(config);
                /*

                var _requestHandler =  = new args.handler(config);

                this._requestHandler = _requestHandler;
                this._resourceRequestHandler = new args.resourceHandler(config);*/

            },
            __onRequest: function(request, response){
                this.fire('request',request, response);
                RequestAcceptor.accept(request, response);
            },
            __staticRequest: function (request, response){

            },
            __dynamicRequest: function (request, response){

            },
            __onConnection: function (socket) {
                this.fire('connection', socket);
                zn.info("connection(idleStart):"+socket._idleStart);
            },
            __onClose: function(){
                this.fire('close', this);
                Logger.info("close");
            }
        }
    });

});