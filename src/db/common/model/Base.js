zn.define(function () {



    return zn.Class("zn.db.common.model.Base", zn.db.data.Model, {
        properties: {
            id: {
                value: null,
                type: ['bigint', 20],
                ignore: true,
                primary: true
            },
            /*
            _id: {
                value: null,
                type: ['char', 36],
                get: function (){
                    return '{uuid()}';
                },
                default: ''
            },*/
            title: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            createTime: {
                value: null,
                type: ['timestamp'],
                ignore: true,
                format: "date_format({},'%Y-%c-%d %h:%i:%s')",
                default: '{now()}'
            },
            createPerson: {
                value: null,
                type: ['int', 11],
                convert: 'zn_convert_user({})',
                get: function (){
                    return zn._request.getSessionKeyValue('@AdminUser', 'id');
                },
                default: 0
            },
            modifyTime: {
                value: null,
                type: ['datetime'],
                ignore: true,
                auto_update: '{now()}',
                format: "date_format({},'%Y-%c-%d %h:%i:%s')",
                default: null
            },
            modifyPerson: {
                value: null,
                type: ['int', 11],
                convert: 'zn_convert_user({})',
                ignore: true,
                auto_update: function (){
                    return zn._request.getSessionKeyValue('@AdminUser', 'id');
                },
                default: 0
            },
            delFlag: {
                value: null,
                type: ['int', 4],
                ignore: true,
                default: 0
            },
            note: {
                value: null,
                type: ['varchar', 250],
                default: ''
            }
        }
    });

})
