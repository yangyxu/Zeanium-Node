zn.define(function () {

    return zn.Class("zn.db.common.model.DefineTable", zn.db.data.Model, {
        properties: {
            zn_define_table_importable: {
                value: null,
                type: ['tinyint', 1],
                default: true
            },
            zn_define_table_exportable: {
                value: null,
                type: ['tinyint', 1],
                default: true
            },
            zn_define_table_inputable: {
                value: null,
                type: ['tinyint', 1],
                default: false
            },
            zn_define_table_outputable: {
                value: null,
                type: ['tinyint', 1],
                default: false
            },
            zn_define_table_parent_id: {
                value: null,
                type: ['int', 11],
                default: 0
            },
            zn_define_table_name: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            zn_define_table_generated: {
                value: null,
                type: ['tinyint', 1],
                default: false
            },
            zn_define_table_mixins: {
                value: null,
                type: ['varchar', 100],
                default: 'zn.db.common.model.Base'
            }
        }
    });

})
