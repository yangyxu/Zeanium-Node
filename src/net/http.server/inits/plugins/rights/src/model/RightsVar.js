zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_rights_var", {
        mixins: [
            model.Base,
            model.Tag,
            model.Tree,
            model.Rights
        ],
        properties: {
            menuId: {
                value: null,
                type: ['int', 11],
                default: '0'
            },
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
