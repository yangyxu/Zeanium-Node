zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_kylin_project", {
        mixins: [
            model.Base,
            model.Rights
        ],
        properties: {
            name: {
                value: null,
                type: ['varchar', 100],
                default: '',
                header: {
                    title: '项目名称',
                    width: 200
                }
            },
            status: {
                value: null,
                type: ['int', 10],
                default: '19',
                convert: 'ZN_PARSE_VAR({})',
                header: {
                    title: '',
                    width: 200
                }
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
                //format: "date_format({},'%Y-%c-%d %h:%i:%s')",
                default: null
            },
            planEndTime: {
                value: null,
                type: ['datetime'],
                ignore: true,
                auto_update: 'now()',
                //format: "date_format({},'%Y-%c-%d %h:%i:%s')",
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
