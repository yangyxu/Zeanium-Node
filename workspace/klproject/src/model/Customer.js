zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_kylin_customer", {
        mixins: [
            model.Base
        ],
        properties: {
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
            contact: {
                value: null,
                type: ['varchar', 15],
                default: ''
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
            logo: {
                value: null,
                type: ['varchar', 50],
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
