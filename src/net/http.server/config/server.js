zn.define([
    '../handler/RestfulRequestHandler',
    '../handler/ResourceRequestHandler',
    '../RequestHandlerChain'
],function (RestfulRequestHandler, ResourceRequestHandler, RequestHandlerChain){

    var _util = {
        parseParam: function (router, path){
            var _data = {},
                _key = null,
                _value = null,
                _paths = path.split('/');
            router.split('/').forEach(function (temp, index){
                if (/^:\w[\w\d]*$/.test(temp)) {
                    _key = temp.replace(/^:/, '');
                    _value = _paths[index];
                    _data[_key] = _value;
                }
            });

            return _data;
        },
        test: function (router, path){
            if (typeof router != 'string') {
                return false;
            }

            var __all = Boolean(router == '*');  //
            var _reg = router.replace(/\/:\w[^\/]+/g, '\/([^\/]+)');
            _reg = _reg.replace(/\//g, '\\/');
            if(router.slice(-3)=='{*}'){
                _reg = '^' + _reg.slice(0, -3); // + '$';
            } else {
                _reg = '^' + _reg + '$';
            }

            //console.log('_reg: ', _reg, router, 'path: ', _req.path);
            var __reg = Boolean(new RegExp(_reg).test(path));

            return Boolean(__all || __reg);
        }
    };


    return {
        host: '127.0.0.1',
        port: 8888,
        catalog: '/webapps/',
        mode: 'debug',     //release, debug, view,
        indexs: ['index.html', 'index.htm', 'default.html', 'default.htm'],
        session: {
            name: '',       //设置 cookie 中，保存 session 的字段名称，默认为 connect.sid
            store: '',      //session 的存储方式，默认存放在内存中，也可以使用 redis，mongodb 等
            genid: '',      //产生一个新的 session_id 时，所使用的函数， 默认使用 uid2 这个 npm 包
            rolling: '',    //每个请求都重新设置一个 cookie，默认为 false
            resave: '',     //即使 session 没有被修改，也保存 session 值，默认为 true
            secret: "d3b07384d113edec49eaa6238ad5ff00",     //通过设置的 secret 字符串，来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
            cookie: {
                // cookie maxAge defaults to 14400000, path defaults to '/' and
                // httpOnly defaults to true.
                maxAge: 60 * 1000,
                domain: 'www.youyang-info.com',
                path: '/',
                expires: '',
                httpOnly: true,
                secure: false
            }
        },
        requestHandlers: [
            {
                name: 'restful',
                min: 0,
                max: 100,
                handlerClass: RestfulRequestHandler,
                mapping: function (url, context, handler){
                    var _routers = context._routers,
                        _chain = new RequestHandlerChain(),
                        _handler = null;
                    for(var key in _routers) {
                        _handler = zn.extend({}, _routers[key]);
                        if(_util.test(key, url)){
                            if(key.indexOf('/:') != -1){
                                _handler.pathArgv = _util.parseParam(key, url);
                            }
                            _chain.push(_handler);
                        }
                    }

                    return _chain.size?_chain:false;
                }
            },
            {
                name: 'resource',
                min: 0,
                max: 5,
                handlerClass: ResourceRequestHandler,
                mapping: function (url, context, handler){
                    return true;
                }
            }
        ]
    }

});
