zn.define([
    'db'
], function (db) {

    return zn.class("BaseModel", db.data.Model, {
        properties: {
            id: {
                value: null,
                type: ['bigint', 20],
                ignore: true,
                primary: true
            },
            delFlag: {
                value: null,
                type: ['varchar', 100],
                ignore: true,
                default: '0'
            },
            createTime: {
                value: null,
                type: ['timestamp'],
                ignore: true,
                format: "date_format({},'%Y-%c-%d %h:%i:%s')",
                default: 'now()'
            },
            modifyTime: {
                value: null,
                type: ['datetime'],
                ignore: true,
                auto_update: 'now()',
                format: "date_format({},'%Y-%c-%d %h:%i:%s')",
                default: null
            },
            note: {
                value: null,
                type: ['varchar', 250],
                default: ''
            }
        }
    });

})