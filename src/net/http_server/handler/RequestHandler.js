/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    '../Request',
    '../Response',
], function (Request, Response) {

    return zn.class('RequestHandler', {
        properties: {
            status: 0,
            handlerManager: null,
            request: null,
            response: null
        },
        methods: {
            init: function (inArgs){
                this.sets(inArgs);
                this.request = new Request();
                this.response = new Response(this.request);
            },
            doRequest: function (serverRequest, serverResponse, handlerManager){
                throw new Error('The Class['+this.toString()+' has not implement doRequest(request, response) method.');
            },
            __reset: function (serverRequest, serverResponse, handlerManager){
                this.sets({
                    status: 0,
                    handlerManager: handlerManager
                });
                this.request.__setRequest(serverRequest);
                this.response.__setResponse(serverResponse);
            }
        }
    });

});