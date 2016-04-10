/**
 * Created by yangyxu on 8/20/14.
 */
zn.define(function () {

    return zn.handler('ResourceRequestHandler', {
        properties: {

        },
        methods: {
            init: function (inConfig){
                this.super(inConfig);
            },
            doRequest: function (request, response){
                this.super(request, response);
                var _paths = request.get('paths'),
                    _file = _paths[_paths.length-1];

                if(!_file){
                    return response.doIndex(), false;
                }
                var _ext = _file.split('.')[1],
                    _project = _paths.shift();

                var _app = this._apps[_project];
                if(!_app){
                    return response.writeURL(request.url), false;
                }

                response.setWebConfig(_app._config);

                if(!_paths.length){
                    return response.doIndex(), false;
                }

                return response.writePath(_app._config.root + zn.SLASH + _paths.join('/')), false;
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
