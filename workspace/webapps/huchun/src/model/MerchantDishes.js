zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_huchun_merchant_dishes", {
        mixins: [
            model.Base
        ],
        properties: {
            menuId: {
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
                type: ['int', 10],
                default: '0'
            },
            price: {
                value: null,
                type: ['int', 10],
                default: '0'
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
            lineStatus: {
                value: null,
                type: ['int', 10],
                default: '0'
            }
        }
    });

})
