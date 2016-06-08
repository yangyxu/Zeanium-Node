/**
 * Created by yangyxu on 7/14/15.
 */
zn.define([
    './Session'
],function (Session) {

    return zn.Class('SessionManager', {
        properties: {

        },
        methods: {
            init: function (argv){
                ///console.log();
            },
            createSession: function (){

            },
            getSession: function (sessionid){
                return new Session();
            }
        }
    });

});
