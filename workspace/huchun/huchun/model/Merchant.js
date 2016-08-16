zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_huchun_merchant", {
        mixins: [
            model.Base
        ],
        properties: {
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
            address: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            contact: {
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
