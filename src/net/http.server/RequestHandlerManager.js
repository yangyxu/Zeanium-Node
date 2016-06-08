/**
 * Created by yangyxu on 8/20/14.
 */
zn.define(function () {

    return zn.Class({
        properties: {
            handlerClass: null,
            mapping: null,
            min: 0,
            max: 20
        },
        methods: {
            init: function (argv, context){
                this._requests = [];
                this._handlers = [];
                this._context = context;
                this.sets(argv);
                var _min = this._min;
                while (_min>0) {
                    this.__createHandler();
                    _min--;
                }
            },
            match: function (url){
                var _mapping = this.mapping || function () { return true; };
                return _mapping(url, this._context, this);
            },
            accept: function (serverRequest, serverResponse, chain){
                /*
                var _handler = new this.handlerClass(this._context);
                _handler.reset(serverRequest, serverResponse);
                _handler.doRequest(_handler._request, _handler._response, this);*/
                this._requests.push([serverRequest, serverResponse, chain]);
                this.doRequest();
            },
            doRequest: function (handler){
                var _size = this._requests.length;
                //zn.debug('Request Size: ' + _size + ', Handler Size: ' + this._handlers.length);
                if(!_size){
                    return;
                }
                var _handler = handler || this.__getHandler();
                if(_handler){
                    var _request = this._requests.shift();
                    _handler.reset(_request[0], _request[1], _request[2]);
                    _handler.doRequest(_handler._request, _handler._response, this);
                } else {
                    this.__createHandler();
                }
            },
            __getHandler: function (){
                var _handlers = this._handlers,
                    _handler = null,
                    _len = _handlers.length;

                for(var i = 0; i < _len; i++){
                    _handler = _handlers[i];
                    if(_handler.status==0){
                        return _handler;
                    }
                }
                if(_len>this.max-1){
                    return;
                } else {
                    return this.__createHandler();
                }
            },
            __createHandler: function (){
                var _handler = new this.handlerClass(this._context);
                _handler.on('done', this.__onHandlerDone.bind(this));
                this._handlers.push(_handler);
                return _handler;
            },
            __onHandlerDone: function (handler){
                var _hLen = this._handlers.length,
                    _rLen = this._requests.length;
                //zn.debug('Finished!  HandlerSize: ' + _hLen + ', RequestSize: ' + _rLen);
                if((_hLen - _rLen) > 3){
                    this._handlers.splice(this._handlers.indexOf(handler), 1);
                    handler.destroy();
                    handler = null;
                    delete handler;
                }
                this.doRequest(handler);
            }
        }
    });

});
