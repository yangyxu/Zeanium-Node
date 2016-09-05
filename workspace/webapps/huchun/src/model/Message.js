zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_huchun_message", {
        mixins: [
            model.Base
        ],
        properties: {
            userId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            merchantId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            link: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            content: {
                value: null,
                type: ['varchar', 200],
                default: ''
            },
            type: {
                value: null,
                type: ['varchar', 100],
                default: 'warning'
            }
        }
    });

})
