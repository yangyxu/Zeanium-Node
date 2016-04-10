/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    'node:url',
    'node:path',
    'node:fs',
    'node:formidable'
],function (url, path, fs, formidable) {

    return zn.class('Request', {
        events: [ 'data', 'end', 'close' ],
        properties: {
            paths: null,
            $data: null,
            $post: null,
            $get: null,
            $files: null,
            serverRequest: null
        },
        methods: {
            init: function (serverRequest, config){
                this._$data = {};
                this._$post = {};
                this._$get = {};
                this._$files = {};
                this._config = config;
                this.setServerRequest(serverRequest);
            },
            getValue: function (inName) {
                return this._$data[inName];
            },
            setValue: function (inKey, inValue){
                return this._$data[inKey] = inValue, this;
            },
            getErrorMessage: function (){
                return this._ERROR_MESSAGE;
            },
            setErrorMessage: function (inValue){
                return this._ERROR_MESSAGE = inValue, this;
            },
            getInt: function (inName) {
                return +(this.getValue(inName));
            },
            getBoolean: function (inName) {
                return new Boolean(this.getValue(inName)).valueOf();
            },
            checkArgs: function (args, response){
                var _defaultValue = null,
                    _newValue = null,
                    _values = zn.extend({}, this._$get, this._$post);

                for(var _key in args){
                    _defaultValue = args[_key];
                    _newValue = _values[_key];

                    if (_defaultValue === undefined && _newValue === undefined){
                        response.error('The value of ' + _key + ' is Required.');
                        return false;
                    }

                    if(zn.type(_defaultValue)=='object'){
                        var _value = _defaultValue.value,
                            _reg = _defaultValue.regexp;

                        if(!_reg.test(_value)){
                            response.error('The value of ' + _key + ' is Invalid.');
                            return false;
                        }
                    }

                    if(_newValue === undefined && _defaultValue){
                        _values[_key] = _defaultValue;
                    }
                }

                return this._$data = _values, _values;
            },
            parse: function (callback){
                this.__parseFormData(callback);
            },
            setServerRequest: function (serverRequest){
                if(!serverRequest){ return false; }
                this._serverRequest = serverRequest;
                this.__parseUrlData(serverRequest);

            },
            __getUploadInfo: function (){
                var _config = this._webConfig,
                    _upload = _config.upload || {},
                    _root = (_config.root || __dirname)+'/uploads/';

                return zn.extend(_upload, {
                    root: _root,
                    temp: 'temp/',
                    catalog: 'catalog/',
                    forward: '',
                    server: 'http://localhost:8888/tj/'
                });
            },
            __parseFormData: function (callback){
                var _self = this,
                    _request = this._serverRequest,
                    _upload = this.__getUploadInfo(),
                    _incomingForm = new formidable.IncomingForm();

                this._upload = _upload;
                _incomingForm.uploadDir = _upload.root + _upload.temp;  //文件上传 临时文件存放路径
                _incomingForm.parse(_request,function(error, fields, files){
                    if(error){
                        zn.error('Request.js   --  line 110 message:  formidable.IncomingForm parse error.');
                    } else {
                        _self._$post = fields;
                        _self._$files = files;
                        callback({ upload: _upload, error: error, fields: fields, files: files });
                    }
                });
            },
            uploadFile: function (file, upload){
                var _name = file.path.split(path.sep).pop(),
                    _ext = file.type.split('/').pop(),
                    _file = _name + '.' + _ext,
                    _upload = upload || this._upload,
                    _root = _upload.root;

                var _path = _root + _upload.temp + _name,
                    _newPath = _root + _upload.catalog + _file;

                _path = _path.replace(/\\/g, '/');
                _newPath = _newPath.replace(/\\/g, '/');
                fs.renameSync(_path, _newPath);

                return {
                    path: _newPath,
                    size: file.size,
                    fileType: file.type,
                    file: _file,
                    name: file.name,
                    ext: _ext,
                    url: path.normalize(_upload.server + '/' + _upload.catalog + '/' + _file),
                    lastModifiedDate: file.lastModifiedDate.toISOString().slice(0, 19)
                };
            },
            uploadFiles: function (files, upload){
                var _upload = upload || this._upload,
                    _catalog = _upload.root + _upload.catalog,
                    _self = this;

                if(!fs.existsSync(_catalog)){
                    fs.mkdirSync(_catalog, 0766);
                }

                return this.__uploadFiles(files);
            },
            __uploadFiles: function (files){
                var _paths = [];
                zn.each(files, function (file){
                    _paths.push(this.uploadFile(file));
                }, this);
                return _paths;
            },
            __parseRequest: function (){
                var _self = this;
                this._dataAry = [];
                this._dataLength = 0;
                request.on('data', function (data) {
                    _self._dataLength += data.length;
                    _self._dataAry.push(data);
                    _self.fire('data', data);
                });

                request.on('end', function () {
                    var _buffer = new Buffer(_self._dataLength),
                        _pos = 0;
                    for (var i = 0, _len = _self._dataAry.length; i < _len; i++) {
                        _self._dataAry[i].copy(_buffer, _pos);
                        _pos += _self._dataAry[i].length;
                    }
                    _self._dataAry = [];
                    _self._dataLength = 0;
                    _self.fire('end', _buffer);
                });

                request.on('close', function(callback){
                    _self.fire('close', callback);
                });
            },
            __parseUrlData: function (request){
                var _req = request,
                    _parse = url.parse(_req.url, true);

                var _paths = _parse.pathname.split('/');
                _paths.shift();
                if(_paths[0]==''){
                    _paths.shift();
                }
                this._$get = _parse.query;
                this._paths = _paths;
                this._uri = '/'+_paths.slice(1).join('/');
                zn.extend(this, _req);
            }
        }
    });

});
