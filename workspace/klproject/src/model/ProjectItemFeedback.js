zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_kylin_project_item_feedback", {
        mixins: [
            model.Base
        ],
        properties: {
            projectId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            projectItemId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            ownerId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            userId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            adminId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            type: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            imgs: {
                value: null,
                type: ['varchar', 5000],
                default: ','
            },
            comment: {
                value: null,
                type: ['varchar', 1000],
                default: ''
            }
        }
    });

})
