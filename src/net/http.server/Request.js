/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    'node:url',
    'node:path',
    'node:fs',
    'node:formidable'
],function (url, path, fs, formidable) {

    return zn.Class({
        events: [ 'data', 'end', 'close' ],
        properties: {
            paths: null,
            $data: null,
            $post: null,
            $get: null,
            $files: null,
            $uploadConfig: null,
            context: null,
            applicationContext: null,
            chain: null,
            session: null,
            serverRequest: {
                value: null,
                get: function (){
                    return this._serverRequest;
                },
                set: function (value){
                    if(!value){ return false; }
                    this.reset();
                    this._serverRequest = value;
                    this.__doSession();
                    this.__parseUrlData();
                    //this.__parseRequest();
                }
            }
        },
        methods: {
            init: function (context, serverRequest){
                this.reset();
                this._context = context;
                this.serverRequest = serverRequest;
            },
            reset: function (){
                this._$data = {};
                this._$post = {};
                this._$get = {};
                this._$files = {};
                this._errors = [];
            },
            getJSON: function (inName){
                var _value = this.getValue(inName);
                if(typeof _value == 'object'){
                    return _value;
                }

                if(_value && typeof _value == 'string'){
                    try {
                        return JSON.parse(_value);
                    } catch (e) {
                        console.error(e);
                    }
                }else {
                    //throw new Error('The parameter is not exist!');
                    zn.error('Request.js line:54   Value of http request parameter(\'' + inName + '\') is ' + this.getValue(inName) + ', it is not json format.');
                    return {};
                }
            },
            getValue: function (inName) {
                if(inName){
                    return this._$data[inName];
                } else {
                    return this._$data;
                }
            },
            setValue: function (inKey, inValue){
                return this._$data[inKey] = inValue, this;
            },
            getErrorMessage: function (){
                return this._errors.join('\n');
            },
            setErrorMessage: function (inValue){
                return this._errors.push(inValue.toString()), this;
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

                    if (_defaultValue == undefined && _newValue === undefined){
                        response.error('Value of http request parameter(\'' + _key + '\') is Required.');
                        return false;
                    }

                    switch (zn.type(_defaultValue)) {
                        case 'object':
                            var _value = _defaultValue.value,
                                _reg = _defaultValue.regexp;

                            if(_reg && !_reg.test(_value)){
                                response.error('Value of http request parameter(\'' + _key + '\') is Invalid.');
                                return false;
                            }
                            break;
                        case 'function':
                            var _temp = _defaultValue(this.getValue(_key), this);
                            if(_temp===false){
                                response.error('Value of http request parameter(\'' + _key + '\') is Invalid.');
                                return false;
                            }

                            break;
                    }

                    if(_newValue === undefined && _defaultValue){
                        _values[_key] = _defaultValue;
                    }
                }

                //TODO: This have to discuss
                if(this._session&&this._session.user){
                    _values.$userId = this._session.user.id;
                }

                return this._$data = _values, _values;
            },
            parse: function (callback){
                this.__parseFormData(callback);
            },
            __doSession: function (){
                this._cookie = this.__parseCookie(this._serverRequest.headers.cookie);
                if(this._cookie){
                    var _value = this._cookie[this._context._sessionManager.name];
                    this._session = this._context._sessionManager.getSession(_value);
                    if(!this._session){
                        this._session = this._context._sessionManager.createSession();
                    }
                } else {
                    this._session = this._context._sessionManager.createSession();
                }

                this._session.cookie.maxAge = this._session.cookie.maxAge || 3600000;
                this._session.cookie.expires = new Date(Date.now() + this._session.cookie.maxAge);
            },
            __getUploadInfo: function (){
                var _config = this.applicationContext._config,
                    _upload = _config.upload || {},
                    _root = (_config.root || __dirname) + zn.SLASH + 'uploads' + zn.SLASH;

                return zn.extend(_upload, {
                    root: _root,
                    temp: 'temp' + zn.SLASH,
                    catalog: 'catalog' + zn.SLASH,
                    forward: '',
                    fileServer: null
                });
            },
            __parseFormData: function (callback){
                var _request = this._serverRequest,
                    _data = _request.data;

                if(_data){
                    this._$post = _data.fields;
                    this._$files = _data.files;
                    this._$uploadConfig = _data.uploadConfig;
                    callback(_data);
                } else {
                    var _ct = _request.headers['content-type']||'';
                    if(_ct.indexOf('text/xml')!=-1){
                        this._$get = (url.parse(_request.url, true).query||{});
                        callback(this._$get);
                    }else {
                        var _upload = this.__getUploadInfo(),
                            _incomingForm = new formidable.IncomingForm(),
                            _uploadDir = _upload.root + _upload.temp;  //文件上传 临时文件存放路径;

                        if(!fs.existsSync(_upload.root)){
                            fs.mkdirSync(_upload.root);
                        }

                        if(!fs.existsSync(_uploadDir)){
                            fs.mkdirSync(_uploadDir);
                        }

                        //_incomingForm.keepExtensions = true;        //使用文件的原扩展名
                        _incomingForm.uploadDir = _uploadDir;
                        _incomingForm.parse(_request,function(error, fields, files){
                            if(error){
                                console.log(error);
                                zn.error('Request.js:  formidable.IncomingForm parse error, ' + error.toString());
                            } else {
                                _data = _request.data = {
                                    fields: fields,
                                    files: files,
                                    uploadConfig: _upload
                                };
                                this._$post = fields;
                                this._$files = files;
                                this._$uploadConfig = _upload;
                                callback(_data);
                            }
                        }.bind(this));
                    }
                }
            },
            uploadFile: function (file, upload){
                var _name = file.path.split(path.sep).pop(),
                    _ext = file.name.split('.').pop(),
                    _file = _name + '.' + _ext,
                    _upload = upload || this._$uploadConfig,
                    _root = _upload.root,
                    _sourceFile = _root + _upload.temp + _name,
                    _targetDir = _root + _upload.catalog;

                if(!fs.existsSync(_targetDir)){
                    fs.mkdirSync(_targetDir);
                }

                if(_upload.keepOriginName){
                    _file = file.name;
                }

                var _targetFile = _targetDir + _file;
                _targetFile = _targetFile.replace(/\\/g, '/');
                _sourceFile = _sourceFile.replace(/\\/g, '/');
                fs.renameSync(_sourceFile, _targetFile);
                var _url = [zn.SLASH, this._applicationContext._deploy].concat(['uploads', _upload.catalog, _file]).join(zn.SLASH);
                return {
                    name: file.name,
                    size: file.size,
                    fileType: file.type,
                    file: _file,
                    ext: _ext,
                    path: _targetFile,
                    url: path.normalize(_url),
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
            clearTempFiles: function (){
                var _data = this._serverRequest.data;
                if(_data && _data.files){
                    zn.each(_data.files, function (file){
                        if(fs.existsSync(file.path)){
                            fs.unlinkSync(file.path);
                        }
                    });
                }
            },
            __uploadFiles: function (files){
                var _paths = [];
                zn.each(files, function (file){
                    _paths.push(this.uploadFile(file));
                }, this);
                return _paths;
            },
            __parseCookie: function (cookie){
                var _data = {},
                    _temp = null,
                    _cookie = cookie || '';

                _cookie && _cookie.split(';').forEach(function(temp) {
                    _temp = temp.split('=');
                    _data[_temp.shift().trim()] = decodeURI(_temp.join('='));
                });

                return _data;
            },
            __parseRequest: function (){
                var _self = this,
                    _serverRequest = this._serverRequest;

                _serverRequest.on('data', function (data) {
                    _self.fire('data', data);
                });

                _serverRequest.on('end', function () {
                    _self.fire('end');
                });

                _serverRequest.on('close', function(callback){
                    _self.fire('close', callback);
                });
            },
            __parseUrlData: function (){
                var _req = this._serverRequest,
                    _parse = url.parse(_req.url, true),
                    _query = _parse.query,
                    _paths = _parse.pathname.split('/');

                _paths.shift();
                if(_paths[0]==''){
                    _paths.shift();
                }
                for(var _key in _query){
                    this._$get[_key] = _query[_key];
                }
                this._paths = _paths;
                this._uri = '/'+_paths.slice(1).join('/');
                this._pathname = _parse.pathname;
                zn.extend(this, _req);
            }
        }
    });

});
