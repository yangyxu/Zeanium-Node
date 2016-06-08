/**
 * Created by yangyxu on 8/20/14.
 */
zn.define(function () {

    return zn.RequestHandler('ResourceRequestHandler', {
        methods: {
            doRequest: function (request, response){
                zn.debug('Resource: ' + request.url);
                var _paths = request.get('paths'),
                    _file = _paths[_paths.length-1],
                    _project = _paths.shift()||'',
                    _context = this._context;

                if(request.url===zn.SLASH){
                    return response.doIndex(), false;
                }

                var _app = _context._apps[_project];
                if(!_app){
                    return response.writeURL(request.url), false;
                }

                response.applicationContext = _app;

                if(!_file){
                    return response.doIndex(), false;
                }

                if(!_paths.length){
                    return response.doIndex(), false;
                }

                return response.writePath(_app._config.root + zn.SLASH + _paths.join(zn.SLASH)), false;
            },
            __200: function (){

            },
            __404: function (){

            },
            __500: function (){

            }
        }
    });

});
