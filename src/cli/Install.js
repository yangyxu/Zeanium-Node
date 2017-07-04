/**
 * Created by yangyxu on 7/14/15.
 */
zn.define([
    'node:fs',
    'node:path'
], function (fs, path) {

    return zn.Class({
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
