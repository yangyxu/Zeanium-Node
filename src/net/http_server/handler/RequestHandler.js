/**
 * Created by yangyxu on 8/20/14.
 */
zn.define(function () {

    var RequestHandler = zn.class('RequestHandler', {
        properties: {
            status: 0,
            root: ''
        },
        methods: {
            init: function (inArgs){
                this._config = inArgs.config;
                this._apps = inArgs.apps;
                this.sets(inArgs);
            },
            doRequest: function (request, response) {
                this._status = 1;
                response.on('close', function (){
                    this._status = 0;
                    zn.info('request closed.');
                }.bind(this));
            }
        }
    });

    zn.handler = function (){
        var _args = arguments,
            _name = _args[0],
            _meta = _args[1];

        _meta.handler = _name;

        return zn.class(_name, RequestHandler, _meta);
    }
    

    return RequestHandler;

});
