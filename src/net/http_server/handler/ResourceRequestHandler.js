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

        },
        methods: {
            init: function (inConfig){
                this._root = inConfig.__dirname + (inConfig.catalog||'/webapps/');
                this.super(inConfig);
            },
            doRequest: function (request, response){
                /*
                var _req = request;
                var _res = response;
                var _ext = request['EXT'].toLowerCase(),
                    _path = request['PATH'];
                var _root = path.normalize(this._root+_path);
                if(!fs.existsSync(_root)){
                    _res.writeHead(404);
                    _res.end("未找到文件："+_path,'utf8');
                }else {
                    fs.readFile(_root, 'binary', function(err,file){
                        if(err){
                            _res.writeHead(500,{'Content-Type':'text/html'});
                            _res.end(err);
                        }else {
                            var _encode = 'binary', _ct = MIME[_ext]||'text/plain';
                            if(_ct==='text/html'){
                                _encode = 'utf8';
                            }
                            _res.writeHead(200,{
                                "Content-Type": _ct,
                                "Content-Length": Buffer.byteLength(file, _encode),
                                "Server":"Zeanium-Server("+process.version+")"
                            });
                            _res.end(file, _encode);
                        }
                    });
                }
                */
            },
            __forward: function (project, controller, action, req, res){
                try{

                }catch(e){
                    zn.error(e.message);
                    req.setParameter('ERROR_MESSAGE', e.message);
                }
            }
        }
    });

});