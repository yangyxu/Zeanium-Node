zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_rights_resource", {
        mixins: [
            model.Base,
            model.Tree,
            model.Rights
        ],
        properties: {
            code: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            userIds: {
                value: null,
                type: ['varchar', 500],
                default: ','
            }
        }
    });

})
