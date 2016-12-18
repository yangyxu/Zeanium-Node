zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_kylin_project_cost_item", {
        mixins: [
            model.Base
        ],
        properties: {
            logo: {
                value: null,
                type: ['varchar', 500],
                default: ''
            },
            code: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            name: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            type: {
                value: null,
                type: ['int', 10],
                convert: 'zn_convert_var({})',
                default: '0'
            },
            status: {
                value: null,
                type: ['int', 10],
                convert: 'zn_convert_var({})',
                default: '0'
            },
            jiCeng: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            caiZhi: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            baoLiuJia: {  //成本价
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            changGuiJia: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            jia1: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            jia2: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            jia3: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            comment: {
                value: null,
                type: ['varchar', 500],
                default: ''
            }
        }
    });

})
