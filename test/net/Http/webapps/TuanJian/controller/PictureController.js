zn.define([
    '../model/Picture',
    '../collection/PictureCollection'
],function (Picture, PictureCollection) {

    var Store = zn.db.data.Store,
        __slice = Array.prototype.slice;

    return zn.controller('picture',{
        properties: {
            
        },
        methods: {
            init: function (args){
                this._collection = this.store('local_mysql').getCollection(Picture, PictureCollection);
            },
            upload: {
                method: 'POST',
                argv: {
                    userId: null
                },
                value: function (request, response, $data, $post, $get, $files) {
                    var _files = request.uploadFiles($files);
                    this._collection.addPictures(_files, $data.userId, $data.region).then(function (data){
                        if(!data){
                            response.error('query no data');
                        }else {
                            response.success(data);
                        }
                    });
                }
            },
            getPicturesByUserId: {
                method: 'GET',
                argv: {
                    userId: null
                },
                value: function (request, response, $data, $post, $get, $files) {
                    this._collection.getPicturesByUserId($data.userId).then(function (data){
                        if(!data){
                            response.error('query no data');
                        }else {
                            response.success(__slice.call(data));
                        }
                    });
                }
            }
        }
    });

});