zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_huchun_order_detail", {
        mixins: [
            model.Base
        ],
        properties: {
            orderId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            merchantDishesId: {
                value: null,
                type: ['int', 10],
                default: '0'
            }
        }
    });

})
