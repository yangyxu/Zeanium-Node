zn.define(function () {

    return zn.Model("zn_dbms_table", {
        mixins: [
            zn.db.common.model.Base,
            zn.db.common.model.Rights
        ],
        properties: {
            name: {
                value: null,
                type: ['varchar', 100],
                default: ''
            }
        }
    });

});
