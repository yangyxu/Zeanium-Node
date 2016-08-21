zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_kylin_user", {
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
            alias: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            status: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            roleId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            roleName: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            star: {
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
                type: ['int', 10],
                default: '0'
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
