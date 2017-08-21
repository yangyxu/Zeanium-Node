zn.define(function () {

    return zn.Class("zn.db.common.model.Base", zn.db.data.Model, {
        properties: {
            id: {
                value: null,
                type: ['bigint', 20],
                ignore: true,
                primary: true
            },
            zn_id: {
                value: null,
                type: ['char', 36],
                get: function (){
                    return zn.uuid();
                }
            },
            zn_title: {
                value: null,
                type: ['varchar', 100]
            },
            zn_create_time: {
                value: null,
                type: ['timestamp'],
                ignore: true,
                format: "date_format({},'%Y-%c-%d %h:%i:%s')",
                default: 'now()'
            },
            zn_create_user: {
                value: null,
                type: ['int', 11],
                convert: 'zn_convert_user({})',
                hidden: true,
                get: function (){
                    return zn._request.getSessionKeyValue('@AdminUser', 'id');
                },
                default: 0
            },
            zn_modify_time: {
                value: null,
                type: ['datetime'],
                ignore: true,
                auto_update: '{now()}',
                format: "date_format({},'%Y-%c-%d %h:%i:%s')",
                hidden: true,
                default: null
            },
            zn_modify_user: {
                value: null,
                type: ['int', 11],
                convert: 'zn_convert_user({})',
                ignore: true,
                hidden: true,
                auto_update: function (){
                    return zn._request.getSessionKeyValue('@AdminUser', 'id');
                },
                default: 0
            },
            zn_deleted: {
                value: null,
                type: ['int', 4],
                ignore: true,
                hidden: true,
                default: 0
            },
            zn_note: {
                value: null,
                type: ['varchar', 250],
                default: ''
            }
        }
    });

})
