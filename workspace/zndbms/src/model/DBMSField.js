zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_dbms_field", {
        mixins: [
            model.Base,
            model.Rights
        ],
        properties: {
            tableId: {
                value: null,
                type: ['bigint', 20],
                default: 0
            },
            name: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            defaultValue: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            dataType: {
                value: null,
                type: ['varchar', 20],
                default: 'varchar'
            },
            dataSize: {
                value: null,
                type: ['int', 10],
                default: 50
            },
            dataSource: {
                value: null,
                type: ['varchar', 200],
                default: ''
            },
            trans: {
                value: null,
                type: ['varchar', 200],
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
