zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_dbms_table", {
        mixins: [
            model.Base,
            model.Rights
        ],
        properties: {
            name: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            alias: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            defineSql: {
                value: null,
                type: ['varchar', 200],
                default: ''
            }
        }
    });

})
