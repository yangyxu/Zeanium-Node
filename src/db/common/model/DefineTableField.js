zn.define(function () {

    return zn.Class("zn.db.common.model.DefineTableField", zn.db.data.Model, {
        properties: {
            zn_define_table: {
                value: null,
                type: ['int', 11],
                default: 0
            },
            zn_define_table_field: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            zn_define_table_field_Type: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            zn_define_table_field_Length: {
                value: null,
                type: ['int', 11],
                default: 0
            },
            zn_define_table_field_Unsigned: {
                value: null,
                type: ['tinyint', 1],
                default: false
            },
            zn_define_table_field_Zerofill: {
                value: null,
                type: ['tinyint', 1],
                default: false
            },
            zn_define_table_field_Binary: {
                value: null,
                type: ['tinyint', 1],
                default: false
            },
            zn_define_table_field_Allow_Null: {
                value: null,
                type: ['tinyint', 1],
                default: false
            },
            zn_define_table_field_Key: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            zn_define_table_field_Default: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            zn_define_table_field_Extra: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            zn_define_table_field_Encoding: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            zn_define_table_field_Collation: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            zn_define_table_field_Comment: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            zn_define_table_field_order: {
                value: null,
                type: ['int', 11],
                default: 0
            },
            zn_define_table_field_convert: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            zn_define_table_field_hidden: {
                value: null,
                type: ['tinyint', 1],
                default: false
            },
            zn_define_table_field_repeat_verify: {
                value: null,
                type: ['tinyint', 1],
                default: false
            },
            zn_define_table_form_title: {
                value: null,
                type: ['varchar', 200],
                default: ''
            },
            zn_define_table_form_name: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            zn_define_table_form_type: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            zn_define_table_form_default: {
                value: null,
                type: ['varchar', 2000],
                default: ''
            },
            zn_define_table_form_value: {
                value: null,
                type: ['varchar', 2000],
                default: ''
            },
            zn_define_table_form_required: {
                value: null,
                type: ['tinyint', 1],
                default: false
            },
            zn_define_table_form_data: {
                value: null,
                type: ['varchar', 2000],
                default: ''
            },
            zn_define_table_form_props: {
                value: null,
                type: ['varchar', 2000],
                default: ''
            },
            zn_define_table_form_attrs: {
                value: null,
                type: ['varchar', 2000],
                default: ''
            },
            zn_define_table_column_width: {
                value: null,
                type: ['int', 11],
                default: null
            },
            zn_plugin_admin_var: {
                value: null,
                type: ['int', 11],
                default: 0
            }
        }
    });

})
