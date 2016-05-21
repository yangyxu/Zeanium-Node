/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    'node:chokidar',
    'node:fs'
],function (chokidar, fs) {

    return zn.Class('FileUtil', {
        static: true,
        methods: {
            init: function (){

            },
            copyDir: function (src, dist, callback){
                fs.access(dist, function(err){
                    if(err){
                        fs.mkdirSync(dist);
                    }
                    this.__copy(src, dist, callback);
                }.bind(this));
            },
            __copy: function (src, dist, callback){
                var _self = this;
                fs.readdir(src, function(err, paths) {
                    if(err){
                        callback(err)
                    } else {
                        paths.forEach(function(path) {
                            var _src = src + '/' +path;
                            var _dist = dist + '/' +path;
                            fs.stat(_src, function(err, stat) {
                                if(err){
                                    callback(err);
                                } else {
                                    if(stat.isFile()) {
                                        fs.writeFileSync(_dist, fs.readFileSync(_src));
                                    } else if(stat.isDirectory()) {
                                        _self.copyDir(_src, _dist, callback)
                                    }
                                }
                            })
                        });
                    }
                });
            }
        }
    });

});
