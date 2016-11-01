zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_admin_user_region", {
        mixins: [
            model.Base
        ],
        properties: {
            userId: {
                value: null,
                type: ['int', 10],
                convert: 'zn_convert_user({})',
                default: '0'
            },
            regions: {
                value: null,
                type: ['varchar', 20],
                convert: 'zn_convert_vars({})',
                default: ','
            },
            provinces: {
                value: null,
                type: ['varchar', 20],
                convert: 'zn_convert_vars({})',
                default: ','
            },
            citys: {
                value: null,
                type: ['varchar', 20],
                convert: 'zn_convert_vars({})',
                default: ','
            }
        }
    });

})
