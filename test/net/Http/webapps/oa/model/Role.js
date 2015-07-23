zn.define(function () {

    var model = zn.db.common.model;

    return zn.model("oa_rights_role", {
        mixins: [
            model.Base,
            model.Tag,
            model.Tree
        ],
        properties: {
            uids: {
                value: null,
                type: ['varchar', 250],
                default: ','
            },
            address: {
                value: null,
                type: ['varchar', 20],
                default: ''
            }
        }
    });

})