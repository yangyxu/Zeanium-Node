zn.define(function () {
    var model = zn.db.common.model;

    return zn.Model("zn_kylin_role", {
        mixins: [
            model.Base
        ],
        properties: {
            name: {
                value: null,
                type: ['varchar', 100],
                default: ''
            }
        }
    });

})
