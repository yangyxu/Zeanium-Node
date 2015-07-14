/**
 * Created by yangyxu on 7/14/15.
 */
zn.define([
    './Session'
],function (Session) {

    return zn.class('SessionManager', {
        static: true,
        properties: {
            all: {},
            counter: 0
        },
        methods: {
            init: function (){

            },
            getSession: function (){
                return new Session();
            }
        }
    });

});