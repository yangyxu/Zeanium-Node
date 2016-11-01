zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_admin_user_log", {
        mixins: [
            model.Base
        ],
        properties: {
            userId: {
                value: null,
                type: ['int', 11],
                convert: 'zn_convert_user({})',
                default: '0'
            },
            actionType: {
                value: null,
                type: ['int', 11],
                default: '0'   //0: 登录， 1: 登出, 2: 系统内操作
            },
            address: {
                value: null,
                type: ['varchar', 250],
                default: ''
            },
            actionSql: {
                value: null,
                type: ['varchar', 250],
                default: ''
            }
        }
    });

})
