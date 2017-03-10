/**
 * Created by yangyxu on 7/14/15.
 */
zn.define([
    'node:fs',
    'node:path',
    'io'
], function (fs, path, io) {

    return zn.Class('Create', {
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
