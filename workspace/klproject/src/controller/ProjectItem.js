zn.define(function () {

    return zn.Controller('projectitem',{
        properties: {

        },
        methods: {
            init: function (args){
                this._action = this.action('ProjectItem');
            },
            createTask: {
                validate: true,
                method: 'GET/POST',
                argv: {
                    projectId: null
                },
                value: function (request, response, chain){
                    this._action.addNode(request.getValue()).then(function (info){
                        this._store.query("update zn_kylin_project set taskAllCount=taskAllCount+1 where id={0}".format(request.getValue('projectId'))).then(function (){
                            response.success(info);
                        });
                    }.bind(this), function (error){
                        response.error(error.message);
                    });
                }
            },
            finishTask: {
                validate: true,
                method: 'GET/POST',
                argv: {
                    projectId: null,
                    id: null
                },
                value: function (request, response, chain){
                    this._action.updateNode({ status: 35 }, request.getValue()).then(function (info){
                        this._store.query("update zn_kylin_project set taskFinishedCount=taskFinishedCount+1 where id={0}".format(request.getValue('projectId'))).then(function (){
                            response.success(info);
                        });
                    }.bind(this), function (error){
                        response.error(error.message);
                    });
                }
            },
            getItemDetail: {
                method: 'GET/POST',
                argv: {
                    itemId: null
                },
                value: function (request, response, chain){
                    var _fields = 'zn_kylin_project_item.*, zn_kylin_customer_shop.title as shopTitle, zn_kylin_customer_shop.address as shopAddress, zn_kylin_customer_shop.contact as shopContact, zn_kylin_customer_shop.phone as shopPhone, zn_convert_var(zn_kylin_project_item.status) as status_convert, zn_convert_var(zn_kylin_project_item.taskType) as taskType_convert, zn_convert_var(zn_kylin_customer_shop.region) as region_convert, zn_convert_var(zn_kylin_customer_shop.province) as province_convert, zn_convert_var(zn_kylin_customer_shop.city) as city_convert, zn_convert_kylin_project(zn_kylin_project_item.projectId) as projectTitle, zn_convert_kylin_customer(zn_kylin_project_item.customerId) as customerTitle, zn_convert_kylin_user(zn_kylin_project_item.workerId) as workerId_convert, zn_convert_user(zn_kylin_project_item.ownerId) as ownerId_convert';
                    var _table = '(zn_kylin_project_item left join zn_kylin_customer_shop on zn_kylin_customer_shop.id=zn_kylin_project_item.customerShopId)';
                    var _sql = 'select ' + _fields + ' from ' + _table + ' where zn_kylin_project_item.id={0};';
                    _sql += "select * from zn_kylin_project_item_attach where projectItemId={0};";

                    this._store.query(_sql.format(request.getInt('itemId'))).then(function (data){
                        response.success(data);
                    }.bind(this), function (error){
                        response.error(error.message);
                    }.bind(this));
                }
            },
            getItem: {
                method: 'GET/POST',
                argv: {
                    itemId: null
                },
                value: function (request, response, chain){
                    this._action.select('*', {
                        id: request.getValue('itemId')
                    }).then(function (data){
                        response.success(data[0]);
                    }.bind(this), function (error){
                        response.error(error.message);
                    }.bind(this));
                }
            },
            uploadAttach: {
                method: 'GET/POST',
                argv: {
                    itemId: null,
                    userId: null
                },
                value: function (request, response, chain){
                    var _files = request.$files, _result = [];
                    var _itemId = request.getInt('itemId'),
                        _userId = request.getInt('userId');
                    var _sqls = [], _upload = null;
                    zn.each(_files, function (file, key){
                        _upload = request.uploadFile(file);
                        _result.push(_upload);
                        _sqls.push("insert into zn_kylin_project_item_attach (projectItemId, userId, path) values ({0},{1},'{2}');".format(_itemId, _userId, _upload.url));
                    });
                    this._store.query(_sqls.join('')).then(function (data){
                        response.success(_result);
                    });
                }
            },
            getItemsByLoginSessionForMobile: {
                validate: true,
                method: 'GET/POST',
                argv: {
                    status: 0
                },
                value: function (request, response, chain){
                    var _where = 'zn_kylin_project_item.workerId=' + request.session.getItem('@KylinUser').id;
                    if(request.getInt('status')){
                        _where += ' and zn_kylin_project_item.status=' + request.getInt('status');
                    }
                    var _fields = 'zn_kylin_project_item.*, zn_kylin_customer_shop.title as shopTitle, zn_kylin_customer_shop.address as shopAddress, zn_kylin_customer_shop.contact as shopContact, zn_kylin_customer_shop.phone as shopPhone, zn_convert_var(zn_kylin_project_item.status) as status_convert, zn_convert_var(zn_kylin_project_item.taskType) as taskType_convert, zn_convert_var(zn_kylin_customer_shop.region) as region_convert, zn_convert_var(zn_kylin_customer_shop.province) as province_convert, zn_convert_var(zn_kylin_customer_shop.city) as city_convert, zn_convert_kylin_project(zn_kylin_project_item.projectId) as projectTitle, zn_convert_kylin_customer(zn_kylin_project_item.customerId) as customerTitle, zn_convert_kylin_user(zn_kylin_project_item.workerId) as workerId_convert, zn_convert_user(zn_kylin_project_item.ownerId) as ownerId_convert';
                    var _table = '(zn_kylin_project_item left join zn_kylin_customer_shop on zn_kylin_customer_shop.id=zn_kylin_project_item.customerShopId)';
                    var _sql = 'select ' + _fields + ' from ' + _table + ' where ' + _where;
                    this._store.query(_sql).then(function (data){
                        response.success(data);
                    }.bind(this), function (error){
                        response.error(error.message);
                    }.bind(this));
                }
            }
        }
    });
});
