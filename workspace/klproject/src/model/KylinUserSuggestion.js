zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_kylin_user_suggestion", {
        mixins: [
            model.Base
        ],
        properties: {
            userId: {
                value: null,
                type: ['int', 10],
                convert: 'zn_convert_kylin_user({})',
                default: '0'
            },
            type: {
                value: null,
                type: ['int', 10],
                convert: 'zn_convert_var({})',
                default: '0'
            },
            comment: {
                value: null,
                type: ['varchar', 500],
                default: ''
            }
        }
    });

})
