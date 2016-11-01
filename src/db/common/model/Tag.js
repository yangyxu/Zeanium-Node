zn.define(function () {

    return zn.Class("zn.db.common.model.Tag", zn.db.data.Model, {
        properties: {
            tags: {
                value: null,
                type: ['varchar', 250],
                ignore: true,
                default: ','
            }
        }
    });

})
