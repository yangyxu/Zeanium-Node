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

    var CHARS = {
        $: '__$',
        BEGIN: '<%',
        END: '%>',
        ENTER: '\n',
        INCLUDE: '####include####'
    }

    zn.include = function (value){
        console.log('include: '+value);
    }

    return zn.Class('Render', {
        properties: {
            start: CHARS.BEGIN,
            end: CHARS.END,
            templete: '',
            templeteConvert: null,
            data: {
                value: {}
            },
            status: RENDER_STATUS.PADDING
        },
        methods: {
            init: function (objs){
                this.sets(objs);
            },
            toRender: function (callback, templete, data){
                var _templete = templete || this.templete,
                    _data = data || this.data,
                    _callback = callback || zn.idle;

                this.set('status', RENDER_STATUS.DOING);
                this.__load(_templete, _data, _callback);
            },
            __filter: function (){

            },
            __escape: function (value){
                return escape(value);
            },
            __unescape: function (value){
                return unescape(value);
            },
            __analyze: function (templete){
                var _$ = CHARS.$,
                    _begin = CHARS.BEGIN,
                    _end = CHARS.END,
                    _enter = CHARS.ENTER,
                    _temp = templete,
                    _self = this,
                    _includes = {};

                _temp = _temp.replace(/\\/g, "\\\\");

                var _beginAry = _temp.split(_begin),
                    _endAry,
                    _endLen = 0,
                    _endFirst = '',
                    _endSecond = '',
                    _body = '',
                    _view = '',
                    _data = '';

                zn.each(_beginAry, function (value, index){
                    _endAry = value.split(_end);
                    _endLen = _endAry.length;
                    _endFirst = _endAry[0].trim();
                    _endSecond = _endAry[1];
                    switch(_endLen){
                        case 1:
                            _body += _$ + ".push('" + _self.__escape(_endFirst) + "');";
                            break;
                        case 2:
                            if(_endFirst.indexOf('include(') !== -1){
                                _view = _endFirst.substring(8, _endFirst.length - 1).split(',');
                                _data = _view[1]||_data;
                                _view = _view[0].substring(1, _view[0].length-1);
                                _endFirst = CHARS.INCLUDE +':' + _view;
                                _includes[_view] = {
                                    view: _view,
                                    data: _data,
                                    tag: _endFirst
                                };
                                _body += _$ + ".push('\\n\\t" + _endFirst + "');";
                            }
                            else if (_endFirst[0] === '=') {
                                _body += _$ + ".push(" + _endFirst.slice(1) + ");";
                            }
                            else {
                                if(_endFirst.indexOf('{') != -1||_endFirst.indexOf('}') != -1){
                                    _body += _endFirst;
                                    //_endSecond = _endSecond.slice(1);
                                    //console.log(_endSecond);
                                }
                            }

                            _body += _$ + ".push('" + _self.__escape(_endSecond) + "');";
                            break;
                        case 3:

                            break;
                    }
                });

                _body = "var " + _$ + " = []; " + _body + " return " + _$+";";

                return [_body, _includes];
            },
            __apply: function (templete, data, callback){
                var _argvs = [],
                    _values = [],
                    _analyze = this.__analyze(templete),
                    _data = data,
                    _context = _data;

                var _temp = _analyze[0],
                    _includes = _analyze[1],
                    _str = '';

                for(var key in _data){
                    _argvs.push(key);
                    _values.push(_data[key]);
                }

                try {
                    _str = (new Function(_argvs, _temp)).apply(_context, _values).join("");
                    _str = this.__unescape(_str);

                    var _count = Object.keys(_includes).length;
                    if(_count){
                        this.__loadIncludes(_str, _includes, _context, _count, callback);
                    }else {
                        callback(_str);
                    }
                } catch (e) {
                    _str = e.toString();
                    zn.error(_str);
                    console.log(e.stack);
                    callback(_str);
                }
            },
            __getContext: function (data){
                var _context = {
                    include: zn.include
                };

                return zn.extend(_context, data);
            },
            __load: function (templete, data, callback){
                var _self = this;
                this.__getTempleteString(templete, function (temp){
                    _self.__apply(temp, data, callback);
                });
            },
            __getTempleteString: function (templete, callback){
                var _templete = this.templeteConvert ? this.templeteConvert(templete) : templete;
                fs.readFile(_templete, {
                    encoding:'utf-8'
                }, function (err, temp) {
                    if (err) {
                        zn.error(err);
                    }else {
                        callback(temp);
                    }
                });
            },
            __loadIncludes: function (temp, includes, context, count, callback){
                var _self = this,
                    _data = context,
                    _curr = 0;

                zn.each(includes, function (include){
                    if (!include.view) { return -1; }
                    if(include.data){
                        _data = context[include.data] || context;
                    }
                    _self.__load(include.view, _data, function (value){
                        _curr++;
                        temp = temp.split(include.tag).join(value);
                        if(_curr==count){
                            callback(temp);
                        }
                    });
                })
            }
        }
    });

});
