zn.define([
    'node:fs',
    'node:url',
    'node:path',
    'node:formidable',
],function (fs, url, path, formidable) {


    return zn.controller('file',{
        properties: {
            
        },
        methods: {
            init: function (args){
                this.super(args);
            },
            test: function (request, response, serverRequest, serverResponse){
                response.writeEnd('hello world!');
            },
            upload: function (request, response, serverRequest, serverResponse) {
                var form = new formidable.IncomingForm(),
                    _self = this;
                var catalog = request.getValue('catalog')||'tmp';
                form.uploadDir = _self.config.uploadDir;  //文件上传 临时文件存放路径
                form.parse(serverRequest,function(error, fields, files){
                    var _path = _self.config.uploadRoot + path.sep + catalog + path.sep;
                    if(!fs.existsSync(_path)){
                        fs.mkdir(_path, 0766, function(err){
                            if(err){
                                response.error(err);
                            }else{
                                _self.__upload(files, catalog, _path, response, fields);
                            }
                        });
                    }else {
                        _self.__upload(files, catalog, _path, response, fields);
                    }
                });
            },
            __upload: function (files, catalog, _path, response, fields){
                var _self = this, _paths = [];
                line.each(files, function (file, name){
                    var _newName = catalog + path.sep+ _self.__getNewFileName(file);
                    var _newPath = _path + _self.__getNewFileName(file);
                    fs.renameSync(file.path, _newPath);
                    _newName =_newName.replace(/\\/g, '/')
                    _paths.push(_self.config.fileDir+_newName);
                });
                var _reurl = fields.reurl||'http://localhost:8888/';
                console.log(_reurl+"?"+_paths.join(','));
                response.forword(_reurl+"?"+_paths.join(','));
            },
            __getNewFileName: function (file) {
                var _filename = file.path.split(path.sep).pop();
                var _ext = file.name.split('.').pop();
                return _filename+'.'+_ext;
            }
        }
    });

});