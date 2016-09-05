zn.define('../action/Rights',function (RightsAction) {

    return zn.Class("zn.db.common.model.Rights", zn.db.data.Model, {
        action: RightsAction,
        properties: {
            ownerId: {
                value: null,
                type: ['int', 11],
                convert: 'zn_convert_user({})',
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
                convert: 'zn_convert_users({})',
                default: ','
            },
            roles: {
                value: null,
                type: ['varchar', 250],
                default: ','
            },
            observeUsers: {
                value: null,
                type: ['varchar', 250],
                default: ','
            },
            observeRoles: {
                value: null,
                type: ['varchar', 250],
                default: ','
            }
        }
    });

})
