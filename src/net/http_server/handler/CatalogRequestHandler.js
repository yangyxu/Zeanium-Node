/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    './RequestHandler',
    '../config/mime',
    '../config/error_message',
    'node:path',
    'node:fs'
],function (RequestHandler, mime, error_message, path, fs) {

    return zn.class('CatalogRequestHandler', RequestHandler, {
        methods: {
            init: function (inConfig){
                this.super(inConfig);
            },
            doRequest: function (serverRequest, serverResponse, config){
                console.log('catalog');
                this.__reset(serverRequest, serverResponse, null);
                var _req = this.request,
                    _url = _req.url,
                    _self = this;

                var _filePath = config.__dirname + config.catalog + _url;
                _filePath = path.normalize(_filePath);

                if(_filePath.slice(-1) === '/'){
                    _filePath = this.__getIndexPath(_filePath, config.indexs);
                }
                if(config.mode==='view'){
                    if(_filePath.slice(-1) === '/'||_filePath.indexOf('.') === -1){
                        this.__readDir(_filePath, '_list');
                    }
                    else {
                        this.__readFile(_filePath);
                    }
                }
                else {
                    var _filePath = this.__getIndexPath(_filePath);
                    if(_filePath.indexOf('.') === -1){
                        this.__readDir(_filePath, '_list');
                    }else {
                        this.__readFile(_filePath);
                    }
                }
            },
            viewModel: function (serverRequest, serverResponse, view, model){
                this.__reset(serverRequest, serverResponse, null);
                this.response.viewModel(view, model);
            },
            doError: function (serverRequest, serverResponse, error){
                this.__reset(serverRequest, serverResponse, null);
                if(!zn.is(error, 'object')){
                    error = error_message[error];
                }
                this.response.viewModel('_error', error);
            },
            __readDir: function (_filePath, view){
                var _self = this,
                    _res = this.response;
                fs.readdir(_filePath, function(err, files){
                    if(err){
                        return _self.__forward(500, '服务器请求错误：' + err);
                    }
                    else {
                        _res.viewModel(view, { files: files });
                    }
                });
            },
            __readFile: function (_filePath){
                var _self = this;

                if(!fs.existsSync(_filePath)){
                    return _self.__forward(404, '未找到资源文件: ' + _filePath);
                }else {
                    fs.readFile(_filePath, 'utf8', function(err, content){
                        if(err){
                            return _self.__forward(500, '服务器请求错误：' + err);
                        }else {
                            return _self.__forward(200, content);
                        }
                    });
                }
            },
            __getIndexPath: function (filePath, indexs){
                var _indexs = indexs||[
                        'index.html',
                        'index.htm',
                        'home.html',
                        'home.htm',
                        'default.html',
                        'default.htm'
                    ];

                _indexs.forEach(function (index){
                    if(fs.existsSync(filePath + index)){
                        filePath += index;
                        return false;
                    }
                });

                return filePath;
            },
            __forward: function (statue, body){
                var _contentType = 'text/html',
                    _encode = 'utf8';

                this.response.writeHead(200, {
                    "Content-Type": _contentType,
                    "Content-Length": Buffer.byteLength(body, _encode)
                });
                this.response.end(body, _encode);
            }
        }
    });

});
