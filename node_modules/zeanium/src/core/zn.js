/**
 * Global Var
 */

var __isServer = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
var zn = {
    VERSION: '0.0.1',
    DEBUG: true,
    ZN_PATH: '',
    PATH: '',
    GLOBAL: (function () {
        if(__isServer){
            return global;
        }else {
            return window;
        }
    }).call(null),
    isServer: __isServer,
    plugin: {}
};

zn.GLOBAL.zn = zn;

if (__isServer) {
    zn.ZN_PATH = __dirname;
    zn.PATH = process.cwd();
    module.exports = zn;
}else{
    var _zn_url = '';
    try{
        __a__ = __b__;
    }
    catch(e){
        if(e.fileName){   //firefox
            _zn_url = e.fileName;
        }
        else if(e.sourceURL){  //safair
            _zn_url = e.sourceURL;
        }
        else if(e.stacktrace){  //opera
            console.log(e.stacktrace);
        }
        else if(e.stack){  //chrome
            _zn_url = e.stack.split('\n')[1];
            _zn_url = _zn_url.replace(/\s/g,"");
            _zn_url = _zn_url.substring(2, _zn_url.length);
        }
        else {
            console.log(e.toString());
        }
    }
    if(!_zn_url){
        var _scripts = document.getElementsByTagName("script"),
            _src = '',
            _node;

        for(var i = 0 , _len = scripts.length; i < _len; i++){
            _node = scripts[i];
            if(_node.getAttribute){
                _src = _node.getAttribute('src') || '';
                if (_src.slice(-5) === 'zn.js'||_src.slice(-10) === 'zn.minx.js') {
                    _zn_url = _src;
                    break;
                }
            }
        }
    }

    if(_zn_url){
        zn.ZN_PATH = _zn_url.substring(0, _zn_url.lastIndexOf('/') + 1);
    }else {
        throw new Error('zn.js has not been included, please do it first.');
    }
}
