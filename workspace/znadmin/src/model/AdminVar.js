zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_admin_var", {
        mixins: [
            model.Base,
            model.Tag,
            model.Tree,
            model.Rights
        ],
        properties: {
            menuId: {
                value: null,
                type: ['int', 11],
                default: '0'
            },
            type: {
                value: null,
                type: ['int', 11],
                default: '0'    //0: 分类, 1: 常量 const, 2: 标签 tag, 3: 按钮 button
            },
            url: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            icon: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            path: {
                value: null,
                type: ['varchar', 100],
                default: ''
            }
        }
    });

})
