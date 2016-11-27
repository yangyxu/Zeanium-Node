zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_kylin_customer_shop", {
        mixins: [
            model.Base
        ],
        properties: {
            customerId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            name: {
                value: null,
                type: ['varchar', 15],
                default: ''
            },
            password: {
                value: null,
                type: ['varchar', 15],
                default: ''
            },
            status: {
                value: null,
                type: ['int', 10],
                convert: 'zn_convert_var({})',
                default: '0'
            },
            region: {
                value: null,
                type: ['int', 10],
                convert: 'zn_convert_var({})',
                default: '0'
            },
            province: {
                value: null,
                type: ['int', 10],
                convert: 'zn_convert_var({})',
                default: '0'
            },
            city: {
                value: null,
                type: ['int', 10],
                convert: 'zn_convert_var({})',
                default: '0'
            },
            address: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            lng: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            lat: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            zipCode: {
                value: null,
                type: ['varchar', 15],
                default: ''
            },
            contact: {
                value: null,
                type: ['varchar', 15],
                default: ''
            },
            phone: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            telephone: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            email: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            images: {
                value: null,
                type: ['varchar', 300],
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
