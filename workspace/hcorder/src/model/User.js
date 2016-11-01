zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_huchun_user", {
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
            status: {
                value: null,
                type: ['int', 10],
                default: 21
            },
            city: {
                value: null,
                type: ['int', 10],
                default: 0
            },
            address: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            alias: {
                value: null,
                type: ['varchar', 100],
                default: ''
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
