zn.define([
    './BaseModel'
], function (BaseModel) {

    return zn.class("City", BaseModel, {
        table: 't_sys_global_city',
        properties: {
            pid: {
                value: null,
                type: ['bigint', 20],
                default: 0
            },
            oid: {
                value: null,
                type: ['bigint', 20],
                default: 0
            },
            depth: {
                value: null,
                type: ['bigint', 20],
                default: 0
            },
            sons: {
                value: null,
                type: ['bigint', 20],
                default: 0
            },
            treeOrder: {
                value: null,
                type: ['bigint', 20],
                default: 0
            },
            parentPath: {
                value: null,
                type: ['varchar', 100],
                default: 0
            },
            nodeName: {
                value: null,
                type: ['varchar', 100],
                default: 0
            },
            alias: {
                value: null,
                type: ['varchar', 100],
                default: 0
            },
            starLevel: {
                value: null,
                type: ['int', 4],
                default: 0
            },
            wants: {
                value: null,
                type: ['bigint', 20],
                default: 0
            },
            gones: {
                value: null,
                type: ['bigint', 20],
                default: 0
            },
            renQi: {
                value: null,
                type: ['bigint', 20],
                default: 0
            },
            commonts: {
                value: null,
                type: ['bigint', 20],
                default: 0
            },
            avatarImg: {
                value: null,
                type: ['varchar', 100],
                default: 0
            },
            type: {
                value: null,
                type: ['bigint', 20],
                default: 0
            },
            state: {
                value: null,
                type: ['bigint', 20],
                default: 0
            },
            link: {
                value: null,
                type: ['varchar', 100],
                default: 0
            }
        }
    });

})