/**
 * Created by yangyxu on 9/17/14.
 */
zn.define(function () {

    return zn.Collection({
        methods: {
            insert: function (values){
                var _defer = zn.async.defer();
                this.beginTransaction()
                    .block(zn.block.tree.addTreeNode(this._table, values))
                    .on('error', function (sender, error){
                        _defer.reject(error);
                    })
                    .on('finally', function (sender, data){
                        _defer.resolve(data);
                    })
                    .commit();

                return _defer.promise;
            },
            delete: function (where){
                var _defer = zn.async.defer();
                this.beginTransaction()
                    .block(zn.block.tree.deleteTreeNode(this._table, where))
                    .on('error', function (sender, error){
                        _defer.reject(error);
                    })
                    .on('finally', function (sender, data){
                        _defer.resolve(data);
                    })
                    .commit();

                return _defer.promise;
            },
            order: function (id, order){
                var _defer = zn.async.defer();
                this.beginTransaction()
                    .block(zn.block.tree.orderTreeNode(this._table, id, order))
                    .on('error', function (sender, error){
                        _defer.reject(error);
                    })
                    .on('finally', function (sender, data){
                        _defer.resolve(data);
                    })
                    .commit();

                return _defer.promise;
            }
        }
    });

});
