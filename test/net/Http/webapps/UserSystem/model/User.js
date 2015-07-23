zn.define(function () {

    var model = zn.db.common.model;

    return zn.model("t_user", {
        mixins: [
            model.Base,
            model.Tag
        ],
        properties: {
            username: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            pwd: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            nickname: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            sex: {
                value: null,
                type: ['int', 11],
                //convert: 'SYS_TRANS_GT({})',
                default: 12
            },
            age: {
                value: null,
                type: ['int', 11],
                default: 0
            },
            follows: {
                value: null,
                type: ['bigint', 20],
                default: 0
            },
            fans: {
                value: null,
                type: ['bigint', 20],
                default: 0
            },
            points: {
                value: null,
                type: ['bigint', 20],
                default: 0
            },
            visits: {
                value: null,
                type: ['bigint', 20],
                default: 0
            },
            totalOrders: {
                value: null,
                type: ['bigint', 20],
                default: 0
            },
            tempOrders: {
                value: null,
                type: ['bigint', 20],
                default: 0
            },
            quote: {
                value: null,
                type: ['varchar', 250],
                default: ''
            },
            email: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            phone: {
                value: null,
                type: ['varchar', 20],
                default: ''
            },
            country: {
                value: null,
                type: ['bigint', 20],
                default: 0
            },
            province: {
                value: null,
                type: ['bigint', 20],
                default: 0
            },
            city: {
                value: null,
                type: ['bigint', 20],
                default: 0
            },
            address: {
                value: null,
                type: ['varchar', 250],
                default: ''
            },
            guiderId: {
                value: null,
                type: ['bigint', 20],
                default: 0
            },
            avatarImg: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            lastLoginTime: {
                value: null,
                type: ['datetime'],
                format: "date_format({},'%Y-%c-%d %h:%i:%s')",
                default: null
            }
        }
    });

})