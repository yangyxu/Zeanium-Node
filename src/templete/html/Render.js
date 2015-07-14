/**
 * Created by yangyxu on 7/14/15.
 */
zn.define([
    'node:fs'
],function (fs) {

    var RENDER_STATUS = {
        PADDING: 0,
        DOING: 1,
        DONE: 2
    };

    return zn.class('Render', {
        properties: {
            templete: '',
            context: {},
            status: RENDER_STATUS.PADDING
        },
        methods: {
            init: function (objs){
                this.sets(objs);
            },
            toHtml: function (){
                var _defer = zn.async.defer(),
                    _self = this;
                this.set('status', RENDER_STATUS.DOING);

                fs.readFile(this.templete, {
                    encoding:'utf-8'
                }, function (err, data) {
                    if (err) {
                        _defer.reject(err);
                    }else {
                        _defer.resolve(_self.__toHtml(data));
                    }

                    _self.set('status', RENDER_STATUS.DONE);
                });

                return _defer.promise;
            },
            __toHtml: function (strValue){



                return strValue;

            }
        }
    });

});