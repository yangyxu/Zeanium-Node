zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_kylin_project_item", {
        mixins: [
            model.Base,
            model.Rights
        ],
        properties: {
            projectId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            projectItemStatus: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            region: {
                value: null,
                type: ['varchar', 50],
                default: '0'
            },
            province: {
                value: null,
                type: ['varchar', 50],
                default: '0'
            },
            city: {
                value: null,
                type: ['varchar', 50],
                default: '0'
            },
            progress: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            planStartTime: {
                value: null,
                type: ['datetime'],
                ignore: true,
                auto_update: 'now()',
                format: "date_format({},'%Y-%c-%d %h:%i:%s')",
                default: null
            },
            planEndTime: {
                value: null,
                type: ['datetime'],
                ignore: true,
                auto_update: 'now()',
                format: "date_format({},'%Y-%c-%d %h:%i:%s')",
                default: null
            },
            shopCode: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            shopName: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            shopAddress: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            shopPhone: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            shopContact: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            regionContactId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            supplier: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            supplierPhone: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            logisticsType: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            logisticsCode: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            issues: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            issuesSolution: {
                value: null,
                type: ['varchar', 200],
                default: ''
            },
            suggest: {
                value: null,
                type: ['varchar', 200],
                default: ''
            }
        }
    });

})
