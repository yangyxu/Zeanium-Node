zn.define(function () {

    var model = zn.db.common.model;

    return zn.model("tj_region", {
        mixins: [
            model.Base
        ],
        properties: {
            location: {
                value: null,
                type: ['varchar', 20],
                default: ''
            },
            detail: {
                value: null,
                type: ['varchar', 20],
                default: ''
            },
            count: {
                value: null,
                type: ['int', 11],
                default: 0
            },
            avatar: {
                value: null,
                type: ['varchar', 50],
                default: 'default.png'
            }
        }
    });

})