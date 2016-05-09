/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    '../Request',
    '../Response'
], function (Request, Response) {

    var RequestHandler = zn.Class('RequestHandler', {
        events: ['init', 'done'],
        properties: {
            status: 0,
            context: null,
            request: null,
            response: null
        },
        methods: {
            init: {
                auto: true,
                value: function (context){
                    this._context = context;
                    this._request = new Request(context);
                    this._response = new Response(context, this._request);
                    this._response.on('end', this.__onFinish.bind(this), this);
                    this.fire('init');
                }
            },
            destroy: function (){
                this._request.destroy();
                this._request = null;
                delete this._request;
                this._response.destroy();
                this._response = null;
                delete this._response;
                this.super();
            },
            reset: function (serverRequest, serverResponse){
                this._request.serverRequest = serverRequest;
                this._response.serverResponse = serverResponse;
                this._status = 1;
            },
            doRequest: function (request, response, chain) {

            },
            __onFinish: function (){
                this._status = 0;
                this.fire('done', this);
            }
        }
    });

    zn.RequestHandler = function (){
        var _args = arguments,
            _name = _args[0],
            _meta = _args[1];

        _meta.handler = _name;

        return zn.Class(_name, RequestHandler, _meta);
    }


    return RequestHandler;

});
