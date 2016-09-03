zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_rights_role", {
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
            roleType: {
                value: null,
                type: ['int', 11],
                default: '0'
            }
        }
    });

})
