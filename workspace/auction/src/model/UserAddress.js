zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_auction_user_address", {
        mixins: [
            model.Base
        ],
        properties: {
            isDefault: {
                value: null,
                type: ['int', 10],
                default: 0
            },
            userId: {
                value: null,
                type: ['int', 10],
                default: 0
            },
            name: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            phone: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            province: {
                value: null,
                type: ['int', 10],
                default: 0
            },
            city: {
                value: null,
                type: ['int', 10],
                default: 0
            },
            area: {
                value: null,
                type: ['int', 10],
                default: 0
            },
            postcode: {
                value: null,
                type: ['varchar', 10],
                default: ''
            },
            address: {
                value: null,
                type: ['varchar', 200],
                default: ''
            }
        }
    });

})
