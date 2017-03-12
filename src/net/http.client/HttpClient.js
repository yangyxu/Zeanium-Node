/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    './config/client'
],function (
    config
) {

    return zn.Class('HttpClient', {
        statics: {
            createClient: function (inArgs) {
                return new this(inArgs);
            }
        },
        properties: {
            context: null
        },
        methods: {
            init: function (args){

            }
        }
    });

});
