zn.define('../action/Tree',function (TreeAction) {

    return zn.Class("zn.db.common.model.Tree", zn.db.data.Model, {
        action: TreeAction,
        properties: {
            type: {
                value: null,
                type: ['int', 11],
                default: '0'
            },
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
            maxCount: {
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
            },
            ext: {
                value: null,
                type: ['varchar', 500],
                default: ''
            }
        }
    });

})
