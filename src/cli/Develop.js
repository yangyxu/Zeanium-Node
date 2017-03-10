/**
 * Created by yangyxu on 7/14/15.
 */
zn.define([
    'node:fs',
    'node:path',
    'node:child_process'
], function (fs, path, child_process) {

    return zn.Class('Develop', {
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
                child_process.exec('zn', function (err,stdout,stderr){
                    if(err){

                    }else {
                        console.log(stdout);
                    }
                });
            }
        }
    });

});
