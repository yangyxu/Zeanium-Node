/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    '../../templete/html/exports.js',
], function (html) {

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
        events: ['end'],
        properties: {
            request: null,
            contentType: 'DEFAULT',
            serverResponse: null,
            view: null
        },
        methods: {
            init: function (request){
                this.set('request', request);
                this._webConfig = {
                    deploy: '',
                    root: __dirname,
                    view: {
                        absolutePath: __dirname,
                        path: '/view/',
                        suffix: 'html'
                    }
                };
            },
            writeHead: function (httpState, inArgs){
                var _self = this,
                    _args = inArgs || {};
                var _head = {
                    'Server': _self.__getServerVersion(),
                    'Content-Type': _self.__getContentType()
                };
                _args = zn.overwrite(_args, _head);

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
            viewModel: function (view, model){
                var _context = this.serverResponse.getContext(),
                    _response = this,
                    _config = this._webConfig;

                _context['contextPath'] = _context['root'] + '/' + _config.deploy;
                zn.extend(model, _context);

                if(view.charAt(0) === '_'){
                    this.view = {
                        absolutePath: zn.SERVER_PATH,
                        path: '/view/',
                        suffix: 'html'
                    }
                }

                _htmlRender.sets({
                    templete: view,
                    templeteConvert: this.__getTempletePath.bind(this),
                    data: model
                });

                _htmlRender.toRender(function (data){
                    _response.contentType = 'HTML';
                    _response.writeHead(200);
                    _response.end(data, 'utf8');
                });
            },
            __getTempletePath: function (view){
                var _view = this.view || this._webConfig.view;

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
            __setResponse: function (response){
                this.serverResponse = response;
            }
        }
    });

});