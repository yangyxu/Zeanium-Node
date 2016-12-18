zn.define(function () {

    return zn.Controller('product',{
        methods: {
            notify: {
                method: 'GET/POST',
                argv: {
                    cancle: 0,
                    userId: null,
                    productId: null
                },
                value: function (request, response, chain){
                    var _data = "notifyCount=notifyCount+1, notifyUsers=concat(notifyUsers, "+request.getValue('userId')+", ',')";
                    if(request.getInt('cancle')==1){
                        _data = "notifyCount=notifyCount-1, notifyUsers=replace(notifyUsers, '"+request.getValue('userId')+",', '')";
                    }
                    var _sql = "update zn_auction_product set {0} where id={1}".format(_data, request.getValue('productId'));
                    this._store.command.query(_sql).then(function (data){
                        response.success(data);
                    }.bind(this), function (error){
                        response.error(error.message);
                    });
                }
            },
            collect: {
                method: 'GET/POST',
                argv: {
                    cancle: 0,
                    userId: null,
                    productId: null
                },
                value: function (request, response, chain){
                    var _data = "collectCount=collectCount+1, collectUsers=concat(collectUsers, "+request.getValue('userId')+", ',')";
                    if(request.getInt('cancle')==1){
                        _data = "collectCount=collectCount-1, collectUsers=replace(collectUsers, '"+request.getValue('userId')+",', '')";
                    }
                    var _sql = "update zn_auction_product set {0} where id={1}".format(_data, request.getValue('productId'));
                    this._store.command.query(_sql).then(function (data){
                        response.success(data);
                    }.bind(this), function (error){
                        response.error(error.message);
                    });
                }
            },
            watch: {
                method: 'GET/POST',
                argv: {
                    productId: null
                },
                value: function (request, response, chain){
                    var _sql = "select * from zn_auction_product where id={0} and status=1;";
                    _sql += "update zn_auction_product set watchCount=watchCount+1 where id={0} and status=1;";
                    this._store.command.query(_sql.format(request.getValue('productId'))).then(function (data){
                        response.success(data);
                    }.bind(this), function (error){
                        response.error(error.message);
                    });
                }
            },
            getTypes: {
                method: 'GET/POST',
                argv: {
                    pid: null
                },
                value: function (request, response, chain){
                    this._store.command.query("select id, title, createTime, img from zn_auction_product_type where pid={0}".format(request.getValue('pid'))).then(function (data){
                        response.success(data);
                    }.bind(this), function (error){
                        response.error(error.message);
                    });
                }
            },
            getProductsByType: {
                method: 'GET/POST',
                argv: {
                    typeId: null
                },
                value: function (request, response, chain){
                    this._store.command.query("select * from zn_auction_product where typeId={0} and status=1".format(request.getValue('typeId'))).then(function (data){
                        response.success(data);
                    }.bind(this), function (error){
                        response.error(error.message);
                    });
                }
            }
        }
    });
});
