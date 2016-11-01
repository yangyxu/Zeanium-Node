zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_auction_merchant", {
        mixins: [
            model.Base
        ],
        properties: {
            code: {
                value: null,
                type: ['varchar', 100],
                default: function (){
                    return 'HC' + (new Date()).getTime();
                }
            },
            alise: {
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
            star: {
                value: null,
                type: ['float', 4],
                default: '0'
            },
            status: {
                value: null,
                type: ['int', 10],
                convert: 'zn_convert_var({})',
                default: 23
            },
            province: {
                value: null,
                type: ['int', 10],
                convert: 'zn_convert_var({})',
                default: 0
            },
            city: {
                value: null,
                type: ['int', 10],
                convert: 'zn_convert_var({})',
                default: 0
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
                type: ['varchar', 20],
                default: ''
            },
            phone: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            hours: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            businessLicense: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            commentCount: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            tags: {
                value: null,
                type: ['varchar', 300],
                default: ','
            },
            perCapita: {
                value: null,
                type: ['float', 4],
                default: '0'
            },
            announcement: {
                value: null,
                type: ['varchar', 300],
                default: ''
            },
            imgs: {
                value: null,
                type: ['varchar', 1000],
                default: ','
            },
            avatarImage: {
                value: null,
                type: ['varchar', 50],
                default: ''
            }
        }
    });

})
