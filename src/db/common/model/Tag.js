zn.define(function () {

    return zn.Class("zn.db.common.model.Tag", zn.db.data.Model, {
        properties: {
            zn_tags: {
                value: null,
                type: ['varchar', 500],
                ignore: true,
                default: ','
            },
            zn_tags_ids: {
                value: null,
                type: ['varchar', 250],
                ignore: true,
                default: ','
            }
        }
    });

})
