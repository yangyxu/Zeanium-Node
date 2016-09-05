zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_kylin_user", {
        mixins: [
            model.Base
        ],
        properties: {
            userId: {
                value: null,
                type: ['int', 10],
                convert: 'zn_convert_user({})',
                default: '0'
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
            alias: {
                value: null,
                type: ['varchar', 100],
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
            workType: {
                value: null,
                type: ['int', 10],
                convert: 'zn_convert_var({})',
                default: '0'
            },
            roleType: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            star: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            workAge: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            age: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            sex: {
                value: null,
                type: ['varchar', 4],
                default: '男'
            },
            mobilePhone: {
                value: null,
                type: ['varchar', 15],
                default: ''
            },
            email: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            cardId: {
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
