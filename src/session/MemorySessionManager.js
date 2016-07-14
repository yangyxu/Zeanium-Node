/**
 * Created by yangyxu on 7/14/15.
 */
zn.define(['./SessionManager'],function (SessionManager) {

    return zn.Class('MemorySessionManager', SessionManager, {
        properties: {

        },
        methods: {
            init: function (config){
                this._sessions = {};
                this.super(config);
            },
            createSession: function (cookie){
                var _session = this.__createSession(cookie);
                this._sessions[_session.id] = _session;
                return _session;
            },
            getSession: function (sessionid){
                var _session = this._sessions[sessionid];
                if(_session){
                    if(new Date(_session.cookie.expires).getTime() < new Date().getTime()){
                        this.remove(sessionid);
                        _session = this.createSession();
                    }
                }

                return _session;
            },
            clear: function (){
                this._sessions = {};
            },
            remove: function (sessionid){
                this._sessions[sessionid] = null;
                delete this._sessions[sessionid];
            },
            update: function (sessionid){
                var _session = this.getSession();
                if(_session){
                    _session.updateId();
                }

                return _session;
            }
        }
    });

});
