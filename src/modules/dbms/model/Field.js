zn.define(function () {

    return zn.Model("zn_dbms_field", {
        mixins: [
            zn.db.common.model.Base,
            zn.db.common.model.Rights
        ],
        properties: {
            name: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            default: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            ignore: {
                value: null,
                type: ['varchar', 100],
                default: 'true'
            },
            primary: {
                value: null,
                type: ['varchar', 100],
                default: 'true'
            }
        }
    });

});
