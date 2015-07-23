zn.define(function () {

    return zn.class("zn.db.common.model.Tree", zn.db.data.Model, {
        properties: {
            pid: {
                value: null,
                type: ['int', 11],
                default: '0'
            },
            depth: {
                value: null,
                type: ['int', 11],
                ignore: true,
                default: '0'
            },
            treeOrder: {
                value: null,
                type: ['int', 11],
                ignore: true,
                default: '0'
            },
            sons: {
                value: null,
                type: ['int', 11],
                ignore: true,
                default: '0'
            },
            parentPath: {
                value: null,
                type: ['varchar', 250],
                ignore: true,
                default: ','
            }
        }
    });

})