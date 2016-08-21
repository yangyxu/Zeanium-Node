zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_kylin_user_worker_comment", {
        mixins: [
            model.Base
        ],
        properties: {
            userId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            projectItemId: {
                value: null,
                type: ['int', 10],
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
