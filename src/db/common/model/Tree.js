zn.define('../collection/Tree',function (Tree) {

    return zn.Class("zn.db.common.model.Tree", zn.db.data.Model, {
        collection: Tree,
        properties: {
            zn_tree_pid: {
                value: null,
                type: ['int', 11],
                default: '0'
            },
            zn_tree_depth: {
                value: null,
                type: ['int', 11],
                ignore: true,
                default: '0'
            },
            zn_tree_order: {
                value: null,
                type: ['int', 11],
                ignore: true,
                default: '0'
            },
            zn_tree_parent_path: {
                value: null,
                type: ['varchar', 250],
                ignore: true,
                default: ','
            },
            zn_tree_son_count: {
                value: null,
                type: ['int', 11],
                ignore: true,
                default: '0'
            },
            zn_tree_max_son_count: {
                value: null,
                type: ['int', 11],
                ignore: true,
                default: '0'
            },
            zn_tree_extend: {
                value: null,
                type: ['varchar', 500],
                default: ''
            },
            zn_tree_type: {
                value: null,
                type: ['int', 11],
                default: '0'
            }
        }
    });

})
