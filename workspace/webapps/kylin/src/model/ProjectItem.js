zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_kylin_project_item", {
        mixins: [
            model.Base,
            model.Rights
        ],
        properties: {
            roles: {
                value: null,
                type: ['varchar', 250],
                default: ',4,13,'
            },
            projectId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            status: {
                value: null,
                type: ['int', 10],
                convert: 'zn_convert_var({})',
                default: '14'
            },
            region: {
                value: null,
                type: ['int', 10],
                convert: 'zn_convert_var({})',
                default: '0'
            },
            province: {
                value: null,
                type: ['int', 10],
                convert: 'zn_convert_var({})',
                default: '0'
            },
            city: {
                value: null,
                type: ['int', 10],
                convert: 'zn_convert_var({})',
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
                default: null
            },
            planEndTime: {
                value: null,
                type: ['datetime'],
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
            taskType: {
                value: null,
                type: ['int', 10],
                convert: 'zn_convert_var({})',
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
            },
            workerId: {
                value: null,
                type: ['int', 10],
                convert: 'zn_convert_var({})',
                default: '0'
            },
            workerIds: {
                value: null,
                type: ['varchar', 50],
                default: ','
            }
        }
    });

})
