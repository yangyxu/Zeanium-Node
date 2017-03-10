/**
 * Created by yangyxu on 7/14/15.
 */
zn.define([
    'node:fs',
    'node:path',
    'io'
], function (fs, path, io) {

    return zn.Class('Install', {
        properties: {
            env: null,
            argv: null
        },
        methods: {
            init: function (env, argv){
                this._env = env;
                this._argv = argv;
                this.exec();
            },
            exec: function (){
                var _configFilePath = this.getConfigFilePath();
                var _name = argv[1];
                if(!_name){
                    zn.error('The plugin name is required.');
                    return;
                }
                if(fs.existsSync(_configFilePath)){
                    var _pluginsDir = __dirname + '/../src/net/http.server/inits/plugins';
                    var _target =  _pluginsDir + '/' + _name;
                    fs.mkdirSync(_pluginsDir);
                    io.FileUtil.copyDir(path.normalize(_target), path.normalize(process.cwd() + zn.SLASH + 'plugins' + zn.SLASH + _name), function (){
                        zn.info('Creating end.');
                    });
                } else {
                    zn.error('The current directory is not an zn app, the file “zn.app.config.js” is required.');
                }
            },
            getConfigFilePath: function (){
                return process.cwd() + zn.SLASH + (this._argv.config || 'zn.app.config.js');
            }
        }
    });

});
