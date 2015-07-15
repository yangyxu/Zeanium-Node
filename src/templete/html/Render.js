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
            data: {},
            status: RENDER_STATUS.PADDING
        },
        methods: {
            init: function (objs){
                this.sets(objs);
            },
            toHtml: function (data){
                var _defer = zn.async.defer(),
                    _self = this;
                this.data = data || this.data;
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
            __analyze: function (templete){
                var _$ = '__$',
                    _begin = '<%',
                    _end = '%>',
                    _temp = templete;

                return "var " + _$ + " = []; " + _$ + ".push('" + _temp.replace(/\\/g, "\\\\")
                    //.replace(/[\r\t\n]/g, " ")
                        //.replace(/[\r\t\b]/g, " ")
                        //.replace(/(\r)/g, "\013")
                        //.replace(/(\t)/g, "\009")
                        .replace(/(\n)/g, "\010")
                    .split("<%").join("\t")
                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)%>/g, "',$1,'")
                    .split("\t").join("');")
                    .split("%>").join(_$ + ".push('")
                    .split("\r").join("\\'").replace(/\t=(.*?)%>/g, "',$1,'")
                + "');return " + _$+";";
            },
            __apply: function (templete){
                var _argvs = [],
                    _values = [],
                    _temp = this.__analyze(templete),
                    _data = this.data;

                for(var key in _data){
                    _argvs.push(key);
                    _values.push(_data[key]);
                }

                var _str = (new Function(_argvs, _temp)).apply(_data, _values).join("");
                _str = _str.split("\010").join('\n');

                return _str.trim();
            },
            __toHtml: function (strValue){
                return this.__apply(strValue);
            }
        }
    });

});