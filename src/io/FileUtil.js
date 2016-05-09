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
                    this.__copy(null, src, dist, callback);
                }.bind(this));
            },
            __copy: function (err, src, dist, callback){
                if(err) {
                    return callback(err);
                }
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
                                    // 判断是文件还是目录
                                    if(stat.isFile()) {
                                        fs.writeFileSync(_dist, fs.readFileSync(_src));
                                    } else if(stat.isDirectory()) {
                                        // 当是目录是，递归复制
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
