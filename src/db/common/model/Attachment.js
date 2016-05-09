zn.define(function () {

    return zn.Class("zn.db.common.model.Attachment", zn.db.data.Model, {
        properties: {
            files: {
                value: null,
                type: ['varchar', 250],
                ignore: true,
                default: ','
            },
            links: {
                value: null,
                type: ['varchar', 250],
                ignore: true,
                default: ','
            }
        }
    });

})
