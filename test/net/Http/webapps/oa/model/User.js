zn.define(function () {

    var model = zn.db.common.model;

    return zn.model("oa_rights_user", {
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
            icCard: {
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
            agents: {
                value: null,
                type: ['varchar', 100],
                default: ','
            },
            department: {
                value: null,
                type: ['bigint', 20],
                default: 0
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
            guiderId: {
                value: null,
                type: ['bigint', 20],
                default: 0
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