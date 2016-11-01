zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_auction_product_type", {
        mixins: [
            model.Base,
            model.Tag,
            model.Tree
        ],
        properties: {
            alias: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            img: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            icon: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            status: {
                value: null,
                type: ['int', 10],
                default: '0'
            }
        }
    });

})
