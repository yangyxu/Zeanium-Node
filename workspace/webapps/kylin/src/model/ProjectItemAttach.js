zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_kylin_project_item_attach", {
        mixins: [
            model.Base
        ],
        properties: {
            projectItemId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            path: {
                value: null,
                type: ['int', 10],
                default: '0'
            }
        }
    });

})
