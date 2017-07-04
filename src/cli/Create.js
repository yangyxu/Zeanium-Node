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
                var _type = argv[1] || 'workspace';
                var _name = argv[2] || '';
                var _target = __dirname + '/../src/net/http.server/inits/' + _type;
                var _source = process.cwd();
                if(_name){
                    _source = _source + zn.SLASH + _name;
                }
                
            }
        }
    });

});
