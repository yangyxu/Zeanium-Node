zn.define([
    'node:os'
], function (os){

    var _path = '/Code/Git/Lib/NodeJS/Project/Nodejs/FileBrowser/';
    _path = os.platform()==='darwin'?_path:'D:\\server\\nodejs\\FileBrowser\\';
    return {
        deploy: 'fs',
        controllers: '/controller/',
        uploadDir: _path + 'tmp',
        uploadRoot: _path + 'upload',
        fileDir: 'http://115.28.169.90:8889/'
    }
});