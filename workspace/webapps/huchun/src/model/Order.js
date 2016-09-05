zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_huchun_order", {
        mixins: [
            model.Base
        ],
        properties: {
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
            merchantUserId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            couponId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            price: {
                value: null,
                type: ['float', 4],
                default: '0'
            },
            discount: {
                value: null,
                type: ['float', 4],
                default: '0'
            },
            discountPrice: {
                value: null,
                type: ['float', 4],
                default: '0'
            }
        }
    });

})
