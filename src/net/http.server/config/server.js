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

            if(router == path){
                return true;
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

    var time = {
        s: 1000,
        n: 60000,
        h: 3600000,
        d: 86400000,
        w: 86400000 * 7
    }


    return {
        host: '127.0.0.1',
        port: 8888,
        catalog: '/webapps/',
        mode: 'debug',     //release, debug, view,
        indexs: ['index.html', 'index.htm', 'default.html', 'default.htm'],
        session: {
            name: 'ZNSESSIONID',
            rolling: false,    //每个请求都重新设置一个 cookie，默认为 false
            secret: "www.youyang-info.com",     //通过设置的 secret 字符串，来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
            cookie: {
                // cookie maxAge defaults to 14400000, path defaults to '/' and
                // httpOnly defaults to true.
                maxAge: 1 * (time.h),
                //domain: '/',
                path: '/',
                expires: '',
                httpOnly: false,
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
                            if(key.indexOf('/:') != -1 || key.indexOf('\:') != -1){
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
