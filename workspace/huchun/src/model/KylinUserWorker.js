zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_kylin_user_worker", {
        mixins: [
            model.Base
        ],
        properties: {
            userId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            status: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            star: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            cardId: {
                value: null,
                type: ['varchar', 50],
                default: ''
            }
        }
    });

})
