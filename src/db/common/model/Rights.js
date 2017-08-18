zn.define('../collection/Rights', function (Rights) {

    return zn.Class("zn.db.common.model.Rights", zn.db.data.Model, {
        collection: Rights,
        properties: {
            zn_rights_owner_id: {
                value: null,
                type: ['int', 11],
                convert: 'zn_convert_user({})'
            },
            zn_rights_enabled: {
                value: null,
                type: ['int', 4],
                ignore: true
            },
            zn_rights_users: {
                value: null,
                type: ['varchar', 250],
                convert: 'zn_convert_users({})',
                default: ','
            },
            zn_rights_roles: {
                value: null,
                type: ['varchar', 250],
                convert: 'zn_convert_roles({})',
                default: ','
            },
            zn_rights_observe_users: {
                value: null,
                type: ['varchar', 250],
                convert: 'zn_convert_users({})',
                default: ','
            },
            zn_rights_observe_roles: {
                value: null,
                type: ['varchar', 250],
                convert: 'zn_convert_roles({})',
                default: ','
            }
        }
    });

})
