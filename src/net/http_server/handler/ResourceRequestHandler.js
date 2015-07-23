/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    './RequestHandler',
    '../config/mime',
    'node:path',
    'node:fs'
],function (RequestHandler, mime, path, fs) {

    return zn.class('ResourceRequestHandler', RequestHandler, {
        properties: {
            root: ''
        },
        methods: {
            init: function (inConfig){
                this.super(inConfig);
            },
            doRequest: function (serverRequest, serverResponse, handlerManager){
                this.__reset(serverRequest, serverResponse, handlerManager);
                var _req = this.request,
                    _paths = _req.get('paths'),
                    _ext = _paths[_paths.length-1].split('.')[1],
                    _project = _paths.shift(),
                    _defaultAppName = handlerManager.defaultDelopyName,
                    _self = this;

                this.status = 1;

                var _app = this.handlerManager.resolveApplication(_project);

                if(!_app){
                    return _self.__forward(404, '未找到项目: ' + _project, 'text/html', 'utf8');
                }

                var _fileName = _paths.join('/'),
                    _filePath = this.root + '/' + _app['_folder'] + '/' + _fileName;
                _filePath = path.normalize(_filePath);

                var _contentType = mime['.'+_ext] || 'text/plain',
                    _encode = _contentType==='text/html' ? 'utf8' : 'binary';

                if(!fs.existsSync(_filePath)){
                    return _self.__forward(404, '未找到资源文件: ' + _fileName, 'text/html', 'utf8');
                }else {
                    fs.readFile(_filePath, 'binary', function(err,file){
                        if(err){
                            return _self.__forward(500, '服务器请求错误：' + err, 'text/html', 'utf8');
                        }else {
                            return _self.__forward(200, file, _contentType, _encode);
                        }
                    });
                }
            },
            __forward: function (statue, body, contentType, encode){
                this.response.writeHead(200, {
                    "Content-Type": contentType,
                    "Content-Length": Buffer.byteLength(body, encode)
                });
                this.response.end(body, encode);
            }
        }
    });

});