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
                default: ',4,13,'
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
                default: '19'
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
            customer: {
                value: null,
                type: ['varchar', 100],
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
            }
        }
    });

})
