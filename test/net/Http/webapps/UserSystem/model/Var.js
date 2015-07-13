line.module([
    './BaseModel'
], function (BaseModel) {

    return line.define("Var", BaseModel, {
        table: 't_sys_global_var',
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
                default: ','
            },
            nodeName: {
                value: null,
                type: ['varchar', 100],
                default: ''
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
                default: ','
            }
        }
    });

})