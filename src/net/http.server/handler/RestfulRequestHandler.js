/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    'node:url'
], function (node_url) {

    return zn.RequestHandler('RestfulRequestHandler', {
        methods: {
            doRequest: function (request, response){
                try{
                    var _url = request.url,
                        _context = this._context,
                        _chain = request.chain;

                    response.upon('finish', function(){
                        this.__onRequestFinish(request, response);
                    }.bind(this));
                    if(_chain && _chain.size>0){
                        response.applicationContext = _chain.applicationContext;
                        request.parse(function (data){
                            _chain.next(request, response);
                        });
                    } else {
                        return response.writeURL(_url), false;
                    }
                }catch(e){
                    zn.error('RestfulRequestHandler doRequest error: ', e.message);
                    console.log(e.stack);
                    return response.forword('__zn__/error/__404');
                }

                return false;
            }
        }
    });
});
