zn.define('../action/Rights',function (RightsAction) {

    return zn.Class("zn.db.common.model.Rights", zn.db.data.Model, {
        action: RightsAction,
        properties: {
            ownerId: {
                value: null,
                type: ['int', 11],
                default: '0'
            },
            ifEnabledRights: {
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
