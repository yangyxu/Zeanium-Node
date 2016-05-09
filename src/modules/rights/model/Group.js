zn.define(function () {

    var model = zn.db.common.model;

    return zn.model("zn_rights_group", {
        mixins: [
            model.Base,
            model.Tag,
            model.Tree
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
