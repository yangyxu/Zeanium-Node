zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_rights_var", {
        mixins: [
            model.Base,
            model.Tag,
            model.Rights
        ],
        properties: {
            url: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            icon: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            path: {
                value: null,
                type: ['varchar', 100],
                default: ''
            }
        }
    });

})
