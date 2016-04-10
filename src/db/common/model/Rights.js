zn.define(function () {

    return zn.class("zn.db.common.model.Rights", zn.db.data.Model, {
        properties: {
            ifRights: {
                value: null,
                type: ['int', 4],
                ignore: true,
                default: '0'
            },
            users: {
                value: null,
                type: ['varchar', 250],
                ignore: true,
                default: ','
            },
            roles: {
                value: null,
                type: ['varchar', 250],
                ignore: true,
                default: ','
            },
            observers: {
                value: null,
                type: ['varchar', 250],
                ignore: true,
                default: ','
            }
        }
    });

})
