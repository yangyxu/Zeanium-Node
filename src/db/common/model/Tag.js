zn.define(function () {

    return zn.Class("zn.db.common.model.Tag", zn.db.data.Model, {
        properties: {
            zn_tag_vars: {
                value: null,
                type: ['varchar', 250],
                ignore: true,
                default: ','
            }
        }
    });

})
