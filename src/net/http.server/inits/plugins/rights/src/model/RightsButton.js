zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_rights_button", {
        mixins: [
            model.Base,
            model.Tag,
            model.Tree,
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
