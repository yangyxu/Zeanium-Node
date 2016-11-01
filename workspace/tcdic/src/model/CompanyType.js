zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_tcdic_company_type", {
        mixins: [
            model.Base
        ],
        properties: {
            logoImage: {
                value: null,
                type: ['varchar', 100],
                default: ''
            }
        }
    });

})
