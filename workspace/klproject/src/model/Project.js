zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_kylin_project", {
        mixins: [
            model.Base,
            model.Rights
        ],
        properties: {
            roles: {
                value: null,
                type: ['varchar', 250],
                default: ',2,15,'
            },
            name: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            status: {
                value: null,
                type: ['int', 10],
                convert: 'zn_convert_var({})',
                default: '20'
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
            customerId: {
                value: null,
                type: ['int', 11],
                default: 0
            },
            ifDefaultContact: {
                value: null,
                type: ['int', 11],
                default: 0
            },
            customer: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            customerContact: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            customerPhone: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            taskAllCount: {
                value: null,
                type: ['int', 11],
                default: 0
            },
            taskFinishedCount: {
                value: null,
                type: ['int', 11],
                default: 0
            }
        }
    });

})
