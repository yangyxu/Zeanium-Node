zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_kylin_customer_shop_adv_frame", {
        mixins: [
            model.Base
        ],
        properties: {
            logo: {
                value: null,
                type: ['varchar', 500],
                default: ''
            },
            customerId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            customerShopId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            name: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            status: {
                value: null,
                type: ['int', 10],
                convert: 'zn_convert_var({})',
                default: '0'
            },
            code: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            position: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            jiCeng: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            caiZhi: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            jingChiCunKuang: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            jingChiCunGao: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            bianYuanChiCunKuang: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            bianYuanChiCunGao: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            count: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            installGuide: {
                value: null,
                type: ['varchar', 2000],
                default: ''
            },
            damaged: {  //是否破损
                value: null,
                type: ['varchar', 500],
                default: ''
            },
            comment: {
                value: null,
                type: ['varchar', 500],
                default: ''
            }
        }
    });

})
