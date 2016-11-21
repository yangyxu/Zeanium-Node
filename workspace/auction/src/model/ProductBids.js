zn.define(function () {

    var model = zn.db.common.model;

    return zn.Model("zn_auction_product_bids", {
        mixins: [
            model.Base
        ],
        properties: {
            alias: {
                value: null,
                type: ['varchar', 100],
                default: ','
            },
            masterId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            auctionTypeId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            typeId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            types: {
                value: null,
                type: ['varchar', 500],
                default: ','
            },
            merchantId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            merchantTypeId: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            currentPrice: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            price: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            earnestMoney: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            increaseStep: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            evaluatePrice: {
                value: null,
                type: ['float', 4],
                default: '0.0'
            },
            unit: {
                value: null,
                type: ['varchar', 10],
                default: '个'
            },
            logo: {
                value: null,
                type: ['varchar', 500],
                default: ''
            },
            imgs: {
                value: null,
                type: ['varchar', 5000],
                default: ','
            },
            videos: {
                value: null,
                type: ['varchar', 5000],
                default: ','
            },
            beginTime: {
                value: null,
                type: ['datetime'],
                default: null
            },
            endTime: {
                value: null,
                type: ['datetime'],
                default: null
            },
            status: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            priceCount: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            applyCount: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            notifyCount: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            watchCount: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            province: {
                value: null,
                type: ['int', 10],
                default: '0'
            },
            city: {
                value: null,
                type: ['int', 10],
                default: '0'
            }
        }
    });

})
