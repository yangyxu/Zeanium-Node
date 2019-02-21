/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    './config/zn.server.config.js',
    './HttpServerContext',
    'node:os',
    'node:http',
    'node:https',
    'node:path'
],function (
    config,
    HttpServerContext,
    node_os,
    node_http,
    node_https,
    node_path
) {
    var _package = require("../../../package.json");

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
                this.__initNodePaths(_config);
                this.__initConfig(_config);
                this.__createHttpServerContext(_config);
            },
            __initNodePaths: function (config){
                var paths = config.node_paths;
                if(!paths || !paths.forEach){
                    return false;
                }
                /*Add current path to NODE_PATH*/
                var _cwd = process.cwd(),
                    _path = null,
                    _parentPaths = [];
                paths.forEach(function (path){
                    _path = node_path.normalize(_cwd + node_path.sep + path);
                    _parentPaths = _parentPaths.concat([_path]);
                    if(config.includeParentPath){
                        _parentPaths = _parentPaths.concat(module.constructor._nodeModulePaths(_path));
                    }
                });

                if(_parentPaths.length){
                    process.env.NODE_PATH = _parentPaths.join(node_path.delimiter) + node_path.delimiter + process.env.NODE_PATH;
                    module.constructor._initPaths();
                    zn.NODE_PATHS = process.env.NODE_PATH.split(node_path.delimiter);
                }
            },
            __createClusterServer: function (config){
                if(node_cluster.isMaster){
                    zn.info("主进程 "+ process.pid + " 正在运行中...");
                    var _cpus = node_os.cpus().length;
                    for(var i = 0; i < _cpus; i++){
                        node_cluster.fork();
                    }
                    node_cluster.on('exit', function (worker, code, signal){
                        zn.error("工作进程 "+worker.process.pid + " 已退出");
                    })
                }else{
                    zn.info("服务启动...");
                    this.__createHttpServer2(config);
                }
            },
            __initConfig: function (config){
                var _port = config.port;
                if(zn.is(_port, 'number')){
                    if(config.clusters){
                        var _min = _port, 
                            _count = zn.is(config.clusters, 'number')?config.clusters:node_os.cpus().length,
                            _max = _min + _count;
                        _port = [_min];
                        while(_min<_max-1){
                            _min++;
                            _port.push(_min);
                        }
                    }else{
                        _port = [_port];
                    }
                }
                
                if(zn.is(_port, 'array')){
                    config.port = _port;
                    return _port.forEach((port)=>this.__createHttpServer(config, port));
                }
            },
            __createHttpServer: function (config, port){
                var _server = null;
                if(config.https){
                    _server = new node_https.Server(config.https);
                }else {
                    _server = new node_http.Server();
                }
                _server.addListener('request', this.__onRequest.bind(this));
                _server.addListener("connection", this.__onConnection.bind(this));
                _server.addListener("close", this.__onClose.bind(this));
                _server.listen(port||config.port, config.host);
                return _server;
            },
            __createHttpServerContext: function (config){
                this._context = new HttpServerContext({
                    config: config,
                    webPath: node_path.join(process.cwd(), (config.catalog||'')),
                    serverPath: __dirname
                });
            },
            __onRequest: function(request, response){
                try{
                    this.fire('request',request, response);
                    if('OPTIONS' == request.method){
                        response.writeHead(200, {
                            'Access-Control-Allow-Origin': (request.headers.origin || request.headers.host || request.headers.Host || ''),
                            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE, PUT',
                            'Access-Control-Allow-Headers': 'Accept,Accept-Charset,Accept-Encoding,Accept-Language,Connection,Content-Type,Cookie,DNT,Host,Keep-Alive,Origin,Referer,User-Agent,X-CSRF-Token,X-Requested-With',
                            "Access-Control-Allow-Credentials": true,
                            'Access-Control-Max-Age': '3600',//一个小时时间
                            'X-Powered-By': (_package.name + '@' + _package.version),
                            'Content-Type': 'text/html;charset=utf-8',
                            'Trailer': 'Content-MD5'
                        });
                        response.write('<a href="https://github.com/yangyxu/zeanium-node">' + _package.name + '</a>');
                        response.addTrailers({'Content-MD5': zn.uuid()});
                        response.end();
                    }else {
                        this._context.accept(request, response);
                    }
                } catch (e){
                    zn.error('HttpServer.js __onRequest error: ' + e.message);
                    console.log(e.stack);
                }
            },
            __onConnection: function (socket) {
                //zn.debug("NEW HTTP Connection[ idleStart ]: " + socket._idleStart);
            },
            __onClose: function(){
                this.fire('close', this);
                zn.info("zeanium-server has closed.");
            }
        }
    });

});
