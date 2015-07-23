zn.define(function () {

    var model = zn.db.common.model;

    return zn.model("oa_rights_menu", {
        mixins: [
            model.Base,
            model.Tag,
            model.Tree,
            model.Rights
        ],
        properties: {
            url: {
                value: null,
                type: ['varchar', 100],
                default: ','
            },
            ext: {
                value: null,
                type: ['varchar', 500],
                default: '{}'
            },
            icon: {
                value: null,
                type: ['varchar', 20],
                default: ''
            },
            ifShortCut: {
                value: null,
                type: ['int', 4],
                default: '0'
            }
        }
    });

})