zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_tcdic_company", {
        mixins: [
            model.Base
        ],
        properties: {
            title: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            type: {
                value: null,
                type: ['int', 10],
                convert: 'zn_convert_company_type({})',
                default: '0'
            },
            country: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            province: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            address: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            contactPhone: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            contact: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            website: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            product: {
                value: null,
                type: ['varchar', 500],
                default: ''
            },
            logoImage: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            imgs: {
                value: null,
                type: ['varchar', 500],
                default: ','
            },
            video: {
                value: null,
                type: ['varchar', 500],
                default: ''
            }
        }
    });

})
