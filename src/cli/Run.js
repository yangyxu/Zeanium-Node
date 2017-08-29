/**
 * Created by yangyxu on 7/14/15.
 */
zn.define([
    'net',
    'node:os',
    'node:fs'
], function (net, os, fs) {

    return zn.Class({
        properties: {
            env: null,
            argv: null
        },
        methods: {
            init: function (env, argv){
                this._env = env;
                this._argv = argv;
                this.start();
            },
            start: function (){
                var _configFilePath = this.getConfigFilePath(),
                    _config = this.getConfig();
                if(fs.existsSync(_configFilePath)){
                    zn.load(_configFilePath, function (config){
                        this.createHttpServer(zn.overwrite(config, _config));
                    }.bind(this));
                }else {
                    this.createHttpServer(_config);
                }
            },
            getConfigFilePath: function (){
                return process.cwd() + zn.SLASH + (this._argv.config || 'zn.server.config.js');
            },
            getConfig: function (){
                return {
                    host: this._argv.host,
                    port: this._argv.port,
                    onLoaded: function (){
                        zn.info('You can press [ control + c ] to stop current zeanium server.');
                    }
                };
            },
            getHost: function (){
                var _host = os.platform() === 'darwin'?'127.0.0.1':'0.0.0.0';
                if(!this._argv.debug){
                    zn.each(os.networkInterfaces(), function (env){
                        zn.each(env, function (item){
                            if(item.family=='IPv4'&&!item.internal){
                                _host = item.address;
                            }
                        })
                    });
                }

                return _host;
            },
            createHttpServer: function (config){
                if(this._argv.debug){
                    zn.debug('Config: ', _config);
                }else {
                    process.on('uncaughtException', function (err) {
                        zn.error(err);
                        zn.error(err.stack);
                    });
                    process.on('exit', function (code) {
                        zn.info('Exit code: ', code);
                    });
                }

                return net.http.HttpServer.createServer(config);
            }
        }
    });

});
