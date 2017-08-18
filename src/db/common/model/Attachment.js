zn.define(function () {

    return zn.Class("zn.db.common.model.Attachment", zn.db.data.Model, {
        properties: {
            zn_attachment_file_ids: {
                value: null,
                type: ['varchar', 250],
                ignore: true,
                default: ','
            },
            zn_attachment_file_paths: {
                value: null,
                type: ['varchar', 1000],
                ignore: true,
                default: ','
            }
        }
    });

})
