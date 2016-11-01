/**
 * Created by yangyxu on 7/14/15.
 */
zn.define([
    './Session'
],function (Session) {

    return zn.Class('SessionManager', {
        properties: {
            name: null,
            cookie: null
        },
        methods: {
            init: function (config){
                this.sets(config);
            },
            __createSession: function (cookie){
                return new Session(this.name, zn.overwrite(cookie||{}, this.cookie));
            }
        }
    });

});
