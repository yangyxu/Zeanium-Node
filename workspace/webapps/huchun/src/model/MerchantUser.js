zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_huchun_merchant_user", {
        mixins: [
            model.Base
        ],
        properties: {
            merchantId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            merchantCode: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            name: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            password: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            status: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            phone: {
                value: null,
                type: ['varchar', 15],
                default: ''
            },
            email: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            avatarImage: {
                value: null,
                type: ['varchar', 50],
                default: ''
            }
        }
    });

})
