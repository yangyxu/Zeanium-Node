/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    './Request',
    './Response'
],function (Request, Response) {

    return zn.class('RequestHandler', {
        properties: {

        },
        methods: {
            init: function (inArgs){
                this.sets(inArgs);
            },
            doRequest: function (request, response){
                throw new Error('The Class has not implement the doRequest method.');
            }
        }
    });

});