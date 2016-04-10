/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    '../../templete/html/exports.js',
    './config/mime',
    'node:fs',
    'node:path'
], function (html, mime, fs, path) {

    var CONTENT_TYPE = {
        'DEFAULT': 'text/plain;charset=UTF-8',
        'HTML':'text/html;charset=UTF-8',
        'XML': 'text/xml;charset=UTF-8',
        'JSON':'application/json;charset=UTF-8',
        'JAVASCRIPT': 'text/javascript;charset=UTF-8'
    };

    var _slice = Array.prototype.slice;

    var _htmlRender = new html.Render();

    return zn.class('Response', {
        events: ['close'],
        properties: {
            request: null,
            contentType: 'DEFAULT',
            serverResponse: null,
            view: null
        },
        methods: {
            init: function (serverResponse, request){
                this.setServerResponse(serverResponse);
                this.set('request', request);
                this._config = request._config;
            },
            setServerResponse: function (serverResponse){
                this._serverResponse = serverResponse;
                serverResponse.on('end', function(){
                    //console.log('end');
                    this.fire('close', this);
                }.bind(this));
            },
            writeHead: function (httpState, inArgs){
                var _self = this,
                    _args = inArgs || {};
                var _crossSetting = {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'X-Requested-With',
                    'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
                    'X-Powered-By': 'zeanium-node@version',
                    'Content-Type': 'application/json;charset=utf-8'
                };

                _args = zn.overwrite(_args, {
                    'Server-Version': _self.__getServerVersion(),
                    'Content-Type': _self.__getContentType()
                });

                this.get('serverResponse').writeHead(httpState, _args);
            },
            write: function(inData, inEncode){
                var _req = this.get('request');
                var _callback = _req.getValue('callback'),
                    _data = JSON.stringify(inData);

                if(_callback){
                    _data = _callback+'('+_data+')';
                    this.contentType = 'JAVASCRIPT';
                }
                this.writeHead(200, {
                    'Content-Type': CONTENT_TYPE[this.contentType]
                });
                this.get('serverResponse').write(_data+'\n\n', inEncode);
            },
            writeContent: function (statue, content, contentType){
                contentType = contentType.toLowerCase();
                var _encode = (contentType=='.html'||contentType=='.htm') ? 'utf8' : 'binary';
                this._serverResponse.writeHead(statue, {
                    "Content-Type": mime[contentType]||'text/plain',
                    "Content-Length": Buffer.byteLength(content, _encode)
                });
                this._serverResponse.end(content, _encode);
            },
            writeLine: function (line, inEncode){
                this.get('serverResponse').write(line, inEncode);
            },
            writePath: function (_path, _encoding){
                _path = path.normalize(_path);
                if(fs.existsSync(_path)){
                    fs.readFile(_path, _encoding, function(err, content){
                        var _ext = _path.split('.').pop();
                        if(err){
                            this.writeContent(500, '服务器错误 Error: ' + err.message, '.html');
                        }else {
                            this.writeContent(200, content, '.' + _ext);
                        }
                    }.bind(this));
                } else {
                    this.writeContent(404, '未找到资源文件: ' + this._request.url, '.html');
                }
            },
            writeURL: function (url, encoding){
                this.writePath(this.__fixBasePath() + url, encoding || 'binary');
            },
            doIndex: function (){
                var _basePath = this.__fixBasePath(), _path;
                zn.each(this._config.indexs || [], function (index){
                    if(fs.existsSync(_basePath + index)){
                        _path = _basePath + index;
                        return false;
                    }
                });

                if(_path){
                    this.writePath(_path);
                } else {
                    this.viewModel('_welcome', {});
                }
            },
            end: function (inData, inEncode) {
                this.get('serverResponse').end(inData, inEncode);
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
                this.__writeJson(inData, inEncode);
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
            setWebConfig: function (webConfig){
                this._webConfig = webConfig;
                if(this._request){
                    this._request._webConfig = webConfig;
                }
            },
            viewModel: function (view, model){
                var _response = this,
                    _config = this._config,
                    _context = _config.__context__;

                if(this._webConfig) {
                    _context['contextPath'] = _context['root'] + zn.SLASH + this._webConfig.deploy;
                }

                zn.extend(model, _context);

                _htmlRender.sets({
                    templete: view,
                    templeteConvert: this.__getTempletePath.bind(this),
                    data: model
                });

                _htmlRender.toRender(function (data){
                    _response.writeContent(200, data, '.html');
                });
            },
            __getTempletePath: function (view){
                var _view = {
                    absolutePath: zn.SERVER_PATH,
                    path: '/view/',
                    suffix: 'html'
                };

                if(this._webConfig){
                    _view = this._webConfig.view || _view;
                    _view.absolutePath = this._webConfig.root;
                }

                if(view.indexOf('.') === -1){
                    view += '.' + _view.suffix;
                }

                return _view.absolutePath + _view.path + view;
            },
            __writeJson: function (inData, inEncode){
                inData.version = this.__getServerVersion();
                this.contentType = 'JSON';
                this.writeEnd(inData, inEncode);
            },
            __getContentType: function (type){
                return CONTENT_TYPE[type||this.contentType];
            },
            __getServerVersion: function (){
                return 'Zeanium-Server V1.0.0';
            },
            __fixBasePath: function (){
                var _basePath = null;
                if(this._webConfig){
                    _basePath = this._webConfig.root;
                } else if(this._config) {
                    _basePath = this._config.webRoot;
                }

                return _basePath + zn.SLASH;
            }
        }
    });

});
