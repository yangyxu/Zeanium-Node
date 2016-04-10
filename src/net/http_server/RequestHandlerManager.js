/**
 * Created by yangyxu on 8/20/14.
 */
zn.define(function (fs) {

    return zn.class('RequestHandlerManager', zn.data.TList, {
        properties: {
            mapping: {
                value: {}
            }
        },
        methods: {
            init: function (args){
                this._TClassArgv = args.TClassArgv;
                this.super(args);
                this.sets(args);
            },
            match: function (path){
                var _mapping = this.get('mapping'),
                    _paths = _mapping.routs,
                    _convert = _mapping.convert,
                    _path = path;

                for(var i= 0, _len = _paths.length; i < _len; i++){
                    if(_convert(_paths[i], _path)){
                        return true;
                    }
                }

                return false;
            },
            accept: function (request, response){
                return this.__getHandler().doRequest(request, response);
            },
            __getHandler: function (argv){
                var _handler = this.findOneT(function (handler, index){
                    if(handler.status === 0){
                        return true;
                    }
                });

                if(!_handler){
                    _handler = this.push(argv || this._TClassArgv);
                }

                return _handler;
            }
        }
    });

});
