zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_huchun_coupon", {
        mixins: [
            model.Base
        ],
        properties: {
            title: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            userId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            merchantId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            price: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            discount: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            discount: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            content: {
                value: null,
                type: ['varchar', 200],
                default: ''
            }
        }
    });

})
