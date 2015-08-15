zn.define(function () {

    var model = zn.db.common.model;

    return zn.model("tj_user", {
        mixins: [
            model.Base,
            model.Tag
        ],
        properties: {
            uid: {
                value: null,
                type: ['varchar', 20],
                default: ''
            },
            pwd: {
                value: null,
                type: ['varchar', 20],
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
            avatar: {
                value: null,
                type: ['varchar', 50],
                default: 'default.png'
            },
            email: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            fixedPhone: {
                value: null,
                type: ['varchar', 20],
                default: ''
            },
            mobilePhone: {
                value: null,
                type: ['varchar', 20],
                default: ''
            },
            pinYin: {
                value: null,
                type: ['varchar', 4],
                default: ''
            },
            qq: {
                value: null,
                type: ['bigint', 20],
                default: 0
            },
            weiXin: {
                value: null,
                type: ['varchar', 20],
                default: ''
            },
            address: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            birthday: {
                value: null,
                type: ['datetime'],
                format: "date_format({},'%Y-%c-%d %h:%i:%s')",
                default: null
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