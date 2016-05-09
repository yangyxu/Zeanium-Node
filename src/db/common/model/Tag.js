zn.define(function () {

    return zn.Class("zn.db.common.model.Tag", zn.db.data.Model, {
        properties: {
            oid: {
                value: null,
                type: ['int', 11],
                ignore: true,
                default: '0'
            },
            type: {
                value: null,
                type: ['int', 11],
                //convert: 'SYS_TRANS_GT({})',
                ignore: true,
                default: '0'
            },
            state: {
                value: null,
                type: ['int', 11],
                //convert: 'SYS_TRANS_GT({})',
                ignore: true,
                default: '0'
            },
            tags: {
                value: null,
                type: ['varchar', 250],
                ignore: true,
                default: ','
            },
            links: {
                value: null,
                type: ['varchar', 250],
                ignore: true,
                default: ','
            }
        }
    });

})
