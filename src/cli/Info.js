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
            init: function (argv){
                this._argv = argv;
                this.exec();
            },
            exec: function (){

            }
        }
    });

});
