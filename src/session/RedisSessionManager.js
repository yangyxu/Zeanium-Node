/**
 * Created by yangyxu on 7/14/15.
 */
zn.define([
    './SessionManager',
    'node:redis'
],function (SessionManager, redis) {

    return zn.Class('RedisSessionManager', SessionManager, {
        methods: {
            init: function (config){
                this._client = redis.createClient(config||{
                    host: '127.0.0.1',
                    port: 6379,
                    parser: 'javascript'
                });
            },
            clearSession: function (){
                var _sessions = this._sessions,
                    _session = null,
                    _now = (new Date()).getTime();
                for(var key in _sessions){
                    _session = _sessions[key];
                    if(_session._expiresTime < _now){
                        this._sessions[_session._id] = null;
                        delete this._sessions[_session._id];
                    }
                }
            },
            createSession: function (cookie){
                var _session = this.__createSession(cookie);
                this._sessions[_session.id] = _session;
                return _session;
            },
            getSession: function (sessionid){
                var _session = this._sessions[sessionid];
                if(_session){
                    if(_session._expiresTime < (new Date()).getTime()){
                        this.remove(sessionid);
                        _session = this.createSession();
                    }
                }
                this.clearSession();
                return _session;
            },
            clear: function (){
                this._sessions = {};
            },
            remove: function (sessionid){
                this._sessions[sessionid] = null;
                delete this._sessions[sessionid];
            },
            size: function (){
                return Object.keys(this._sessions).length;
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
