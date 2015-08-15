zn.define(function () {

    var model = zn.db.common.model;

    return zn.model("tj_picture", {
        mixins: [
            model.Base,
            model.Tag
        ],
        properties: {
            userId: {
                value: null,
                type: ['int', 11],
                default: 0
            },
            regionId: {
                value: null,
                type: ['int', 11],
                default: 0
            },
            regionName: {
                value: null,
                type: ['varchar', 20],
                default: ''
            },
            url: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            path: {
                value: null,
                type: ['varchar', 200],
                default: ''
            },
            size: {
                value: null,
                type: ['int', 11],
                default: 0
            },
            fileType: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            file: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            name: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            ext: {
                value: null,
                type: ['varchar', 10],
                default: ''
            },
            address: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            detail: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            location: {
                value: null,
                type: ['varchar', 100],
                default: '{}'
            },
            lastModifiedDate: {
                value: null,
                type: ['datetime'],
                format: "date_format({},'%Y-%c-%d %h:%i:%s')",
                default: null
            }
        }
    });

})