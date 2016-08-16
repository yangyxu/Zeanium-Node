zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_huchun_merchant_menu", {
        mixins: [
            model.Base,
            model.Tree
        ],
        properties: {
            merchantId: {
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
