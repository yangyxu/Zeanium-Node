/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    'node:fs'
],function (fs) {

    return zn.Class('Logger', {
        static: true,
        methods: {
            init: function (){

            },
            writeToFile: function (value, path){
                var _path = path || this.config.path;
                var _fws = fs.createWriteStream('./new_myjpg.jpg',{
                    flags: 'w',
                    encoding: null,
                    mode: 0666
                });
                _fws.write(value);
                _fws.end();
            }
        }
    });

});
