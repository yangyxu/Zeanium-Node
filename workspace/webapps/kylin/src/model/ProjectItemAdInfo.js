zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_kylin_project_item_adinfo", {
        mixins: [
            model.Base
        ],
        properties: {
            projectItemId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            height: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            width: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            number: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            area: {
                value: '123',
                type: ['int', 10],
                default: '0'
            },
            installSolution: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            comment: {
                value: null,
                type: ['varchar', 100],
                default: ''
            }
        }
    });

})
