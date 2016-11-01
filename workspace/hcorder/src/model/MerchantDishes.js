zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_huchun_merchant_dishes", {
        mixins: [
            model.Base
        ],
        properties: {
            masterId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            merchantId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            salePrice: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            price: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            unit: {
                value: null,
                type: ['varchar', 10],
                default: '个'
            },
            img: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            remainNum: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            status: {
                value: null,
                type: ['int', 10],
                default: '0'
            }
        }
    });

})
